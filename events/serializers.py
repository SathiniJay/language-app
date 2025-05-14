from rest_framework import serializers
from .models import AppUsers,Conversation, ConversationContent, Language, Hint, Progress, InfoGapExercise, InfoGapListDeliContent, InfoGapMapTownCentreContent, InfoGapMatricesInterviewContent, InfoGapSession, InfoGapHint

class AppUsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppUsers
        fields = ['emailAddress', 'languageId', 'birthDate']

class ConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        fields = '__all__'

class ConversationContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConversationContent
        fields = '__all__'

class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = '__all__'

class HintSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hint
        fields = '__all__'

class ProgressSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.emailAddress', read_only=True)
    language_name = serializers.CharField(source='language.languageName', read_only=True)
    conversation_level = serializers.CharField(source='conversation.conversationLevel', read_only=True)
    conversation_context = serializers.CharField(source='conversation.context', read_only=True)
    conversation_scenario = serializers.CharField(source='conversation.scenario', read_only=True)

    class Meta:
        model = Progress
        fields = [
            'id', 'user_email', 'language_name', 'conversation_level', 
            'conversation_context', 'conversation_scenario', 
            'person', 'completed_times'
        ]
        read_only_fields = ['user_email', 'language_name', 'conversation_level', 'conversation_context', 'conversation_scenario']

# Serializer for the main info gap exercise data
class InfoGapExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = InfoGapExercise
        fields = '__all__'

# Serializer for the Information Gap List (Grocery Deli scenario)
class InfoGapListDeliContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = InfoGapListDeliContent
        fields = '__all__'

# Serializer for the Information Gap Map (Town Centre map scenario)
class InfoGapMapTownCentreContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = InfoGapMapTownCentreContent
        fields = '__all__'

# Serializer for the Information Gap Matrices (Interview scenario)
class InfoGapMatricesInterviewContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = InfoGapMatricesInterviewContent
        fields = '__all__'

# Serializer for managing real-time two-person sessions
class InfoGapSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = InfoGapSession
        fields = '__all__'

# Serializer for multilingual vocabulary hints associated with exercises
class InfoGapHintSerializer(serializers.ModelSerializer):
    class Meta:
        model = InfoGapHint
        fields = '__all__'