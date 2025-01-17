from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import authenticate, login
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from datetime import datetime

@api_view(['POST'])
def login_user(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({'error': 'Both email and password are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
        if user.check_password(password):
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid email or password'}, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        return Response({'error': 'user does not exist'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not username or not email or not password:
        return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)
    user.save()

    # Generate a token for the user
    token, created = Token.objects.get_or_create(user=user)

    return Response({
        "message": "User registered successfully",
        "token": token.key  
    }, status=status.HTTP_201_CREATED)

@api_view(['GET', 'POST'])  # Allow both GET and POST requests
@permission_classes([IsAuthenticated])  # Ensure only authenticated users can access this view
def user_profile(request):
    user = request.user

    if request.method == 'GET':
        # Return user profile data, including the birth_date if available
        return Response({
            'username': user.username,
            'email': user.email,
            'joined_date': user.date_joined.strftime('%d %B %Y'),
        })

    elif request.method == 'POST':
        # Update user profile
        username = request.data.get('username')
        password = request.data.get('password')

        # Update username if provided
        if username:
            user.username = username

        # Update password if provided
        if password:
            user.set_password(password)

        user.save()  # Save the changes to the user object

        return Response({'message': 'Profile details updated successfully'}, status=status.HTTP_200_OK)