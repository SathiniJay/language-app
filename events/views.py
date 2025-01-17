from rest_framework import viewsets, status
from rest_framework.response import Response
from django.http import Http404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import AppUsers, Conversation, ConversationContent, Language, Hint, Progress
from .serializers import AppUsersSerializer, ConversationSerializer, ConversationContentSerializer, LanguageSerializer, HintSerializer, ProgressSerializer

class AppUsersViewSet(viewsets.ModelViewSet):
    queryset = AppUsers.objects.all()
    serializer_class = AppUsersSerializer

    def get_object(self):
        email = self.kwargs.get('email')
        try:
            return AppUsers.objects.get(emailAddress=email)
        except AppUsers.DoesNotExist:
            raise Http404("User not found")

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        print(request.data)  
        serializer = self.get_serializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ConversationViewSet(viewsets.ModelViewSet):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer

class ConversationContentViewSet(viewsets.ModelViewSet):
    queryset = ConversationContent.objects.all()
    serializer_class = ConversationContentSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        conversation_id = self.request.query_params.get('conversationId')
        if conversation_id:
            queryset = queryset.filter(conversationId_id=conversation_id) 
        return queryset


class LanguageViewSet(viewsets.ModelViewSet):
    queryset = Language.objects.all()
    serializer_class = LanguageSerializer

class HintViewSet(viewsets.ModelViewSet):
    queryset = Hint.objects.all()
    serializer_class = HintSerializer
    
class ProgressViewSet(viewsets.ModelViewSet):
    queryset = Progress.objects.all()
    serializer_class = ProgressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Allow users to see only their progress
        user = self.request.user
        return Progress.objects.filter(user__emailAddress=user.email)

    def perform_create(self, serializer):
        # Automatically associate the logged-in user with the progress record
        serializer.save(user=self.request.user)

@api_view(['GET', 'POST'])
def progress_view(request):
    if request.method == 'POST':
        print('Received Data:', request.data)

        try:
            # Extract the data from the request
            email = request.data.get('user')
            language_id = int(request.data.get('language'))
            conversation_id = int(request.data.get('conversation'))
            person = request.data.get('person')
            completed_times = request.data.get('completed_times', 1)  # Default to 1 if not provided

            # Ensure all required fields are present
            if not all([email, language_id, conversation_id, person]):
                return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

            # Lookup the user by email
            user = AppUsers.objects.filter(emailAddress=email).first()
            if not user:
                return Response({'error': 'User does not exist'}, status=status.HTTP_400_BAD_REQUEST)

            # Retrieve the language and conversation instances
            language = Language.objects.get(id=language_id)
            conversation = Conversation.objects.get(id=conversation_id)

            # Check for an existing progress entry
            existing_progress = Progress.objects.filter(
                user=user,
                language=language,
                conversation=conversation,
                person=person
            ).first()

            if existing_progress:
                # Increment completed_times
                existing_progress.completed_times += 1
                existing_progress.save()  # Save the updated progress instance
                serializer = ProgressSerializer(existing_progress)
                return Response(serializer.data, status=status.HTTP_200_OK)  # Return updated progress entry
            else:
                # Create a new Progress instance
                progress = Progress(
                    user=user,
                    language=language,
                    conversation=conversation,
                    person=person,
                    completed_times=1  # Set to 1 for a new entry
                )
                progress.save()  # Save the new progress instance
                serializer = ProgressSerializer(progress)
                return Response(serializer.data, status=status.HTTP_201_CREATED)  # Return the new progress entry

        except ValueError:
            return Response({'error': 'Invalid data types'}, status=status.HTTP_400_BAD_REQUEST)
        except Language.DoesNotExist:
            return Response({'error': 'Language does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        except Conversation.DoesNotExist:
            return Response({'error': 'Conversation does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
    elif request.method == 'GET':
        # Retrieve data from query parameters
        email = request.query_params.get('user')  # Extract user email from query params
        if not email:
            return Response({'error': 'User email is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = AppUsers.objects.get(emailAddress=email)
        except AppUsers.DoesNotExist:
            return Response({'error': 'User does not exist'}, status=status.HTTP_400_BAD_REQUEST)

        # Retrieve only the authenticated user's progress entries
        progress_entries = Progress.objects.filter(user=user)
        serializer = ProgressSerializer(progress_entries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)