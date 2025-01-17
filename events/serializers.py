from rest_framework import serializers
from .models import AppUsers,Conversation, ConversationContent, Language, Hint, Progress

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
