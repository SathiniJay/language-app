from rest_framework import viewsets, status
from rest_framework.response import Response
from django.http import Http404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import AppUsers, Conversation, ConversationContent, Language, Hint, Progress, InfoGapExercise, InfoGapListDeliContent, InfoGapMapTownCentreContent, InfoGapMatricesInterviewContent, InfoGapSession, InfoGapHint
from .serializers import AppUsersSerializer, ConversationSerializer, ConversationContentSerializer, LanguageSerializer, HintSerializer, ProgressSerializer, InfoGapExerciseSerializer, InfoGapListDeliContentSerializer, InfoGapMapTownCentreContentSerializer, InfoGapMatricesInterviewContentSerializer, InfoGapSessionSerializer, InfoGapHintSerializer
import random
import string

# -------------------- ViewSets for CRUD operations --------------------
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

# ViewSet for managing InfoGapExercise objects (GET, POST, PUT, DELETE)
class InfoGapExerciseViewSet(viewsets.ModelViewSet):
    queryset = InfoGapExercise.objects.all()
    serializer_class = InfoGapExerciseSerializer

# ViewSet for Information Gap List (Grocery Deli scenario)
class InfoGapListDeliContentViewSet(viewsets.ModelViewSet):
    queryset = InfoGapListDeliContent.objects.all()
    serializer_class = InfoGapListDeliContentSerializer

# ViewSet for Information Gap Map (Town Centre map scenario)
class InfoGapMapTownCentreContentViewSet(viewsets.ModelViewSet):
    queryset = InfoGapMapTownCentreContent.objects.all()
    serializer_class = InfoGapMapTownCentreContentSerializer

# ViewSet for Information Gap Matrices (Interview scenario)
class InfoGapMatricesInterviewContentViewSet(viewsets.ModelViewSet):
    queryset = InfoGapMatricesInterviewContent.objects.all()
    serializer_class = InfoGapMatricesInterviewContentSerializer    

# -------------------- Custom API Views --------------------

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
    
# Function to generate a 5-character session code for session managemnet in info gap exercises(uppercase letters + digits)
def generate_session_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=5))
    
# API to create a new session (used by Person A)
@api_view(['POST'])
def create_session(request):
    exercise_id = request.data.get("infoGapExerciseId")
    try:
        # Get the associated exercise object
        exercise = InfoGapExercise.objects.get(infoGapExerciseId=exercise_id)
    except InfoGapExercise.DoesNotExist:
        return Response({"error": "Invalid InfoGapExerciseId"}, status=400)

    # Generate session and mark Person A as joined
    session_code = generate_session_code()
    session = InfoGapSession.objects.create(
        session_code=session_code,
        exercise=exercise,
        person_a_joined=True
    )
    serializer = InfoGapSessionSerializer(session)
    return Response(serializer.data, status=201)

# API for Person B to join an existing session
@api_view(['POST'])
def join_session(request):
    session_code = request.data.get("sessionCode")
    exercise_id = request.data.get("infoGapExerciseId")

    try:
        session = InfoGapSession.objects.get(session_code=session_code)
        # Make sure the exercise IDs match
        if str(session.exercise.infoGapExerciseId) != str(exercise_id):
            return Response({"error": "Exercise ID mismatch."}, status=403)
        session.person_b_joined = True
        session.save()
        return Response(InfoGapSessionSerializer(session).data)
    except InfoGapSession.DoesNotExist:
        return Response({"error": "Session code not found."}, status=404)
    
# API to check if both users have joined a session (polled from frontend)
@api_view(['GET'])
def session_status(request, session_code):
    try:
        session = InfoGapSession.objects.get(session_code=session_code)
        return Response({
            "person_a_joined": session.person_a_joined,
            "person_b_joined": session.person_b_joined,
        })
    except InfoGapSession.DoesNotExist:
        return Response({"error": "Session not found"}, status=404)
    
# API to fetch translated word hints based on language and exercise ID
@api_view(['GET'])
def get_info_gap_hints(request):
    language_name = request.GET.get('languageName')
    exercise_id = request.GET.get('infoGapExerciseId')

    if not language_name or not exercise_id:
        return Response({"error": "Missing parameters"}, status=400)

    # Filter by InfoGapExercise
    hints = InfoGapHint.objects.filter(infoGapExerciseId=exercise_id)

    # Return result only with the related language column
    results = []
    for hint in hints:
        translated = getattr(hint, language_name.lower(), None)
        if translated:
            results.append({
                "word": hint.word,
                "hint": translated
            })

    return Response(results)

# API for marking an exercise as completed by a person
@api_view(['POST'])
def mark_completed(request):
    session_code = request.data.get("session_code")
    person = request.data.get("person") # "A" or "B"

    try:
        session = InfoGapSession.objects.get(session_code=session_code)
        if person == "A":
            session.person_a_completed = True
        elif person == "B":
            session.person_b_completed = True
        session.save()

        both_done = session.person_a_completed and session.person_b_completed
        return Response({ "bothCompleted": both_done })

    except InfoGapSession.DoesNotExist:
        return Response({ "error": "Session not found" }, status=404)