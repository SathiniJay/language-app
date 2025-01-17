from django.contrib import admin
from import_export import resources
from import_export.admin import ImportExportModelAdmin

from .models import AppUsers, Conversation, ConversationContent, Hint, Language, Progress

# Define a resource class for the Conversation model
class ConversationResource(resources.ModelResource):
    class Meta:
        model = Conversation
        fields = (
            'id',
            'conversationId',
            'conversationLevel',
            'context',
            'scenario',
            'nativeLanguageId',
            'learningLanguageId'
        )
        import_id_fields = ['id']

# Define an admin class for Conversation to enable import/export functionality
class ConversationAdmin(ImportExportModelAdmin):
    resource_class = ConversationResource
    list_display = ('conversationId', 'conversationLevel', 'context', 'scenario')
    search_fields = ('conversationId', 'context', 'scenario')

# Define a resource class for the ConversationContent model
class ConversationContentResource(resources.ModelResource):
    class Meta:
        model = ConversationContent
        fields = ('id','contentId', 'conversationId__conversationId', 'person', 'line', 'prompt')
        import_id_fields = ['id']

# Define an admin class for ConversationContent to enable import/export functionality
class ConversationContentAdmin(ImportExportModelAdmin):
    resource_class = ConversationContentResource
    list_display = ('contentId', 'conversationId', 'person', 'line', 'prompt')
    search_fields = ('contentId', 'conversationId__conversationId', 'person', 'line','prompt')

# Define a resource class for the Hint model
class HintResource(resources.ModelResource):
    class Meta:
        model = Hint
        fields = ('id', 'hintId', 'contentId', 'word', 'spanish', 'chinese', 'italian','german', 'french', 'arabic','russian', 'japanese')  # Adjust fields as needed
        import_id_fields = ['id']

# Define an admin class for Hint to enable import/export functionality
class HintAdmin(ImportExportModelAdmin):
    resource_class = HintResource
    list_display = ('id', 'hintId', 'contentId', 'word', 'spanish', 'chinese', 'italian','german', 'french', 'arabic','russian', 'japanese')  # Adjust display fields as needed
    search_fields = ('hintId', 'word')  
    
class ProgressResource(resources.ModelResource):
    class Meta:
        model = Progress
        fields = (
            'id',
            'user__emailAddress',  # To show user's email
            'language__languageName',  # To show language name
            'conversation__conversationId',  # To show conversation ID
            'person',
            'completed_times',
        )
        import_id_fields = ['id']

class ProgressAdmin(ImportExportModelAdmin):
    resource_class = ProgressResource
    list_display = ('user', 'language', 'conversation', 'person', 'completed_times')
    search_fields = ('user__emailAddress', 'language__languageName', 'conversation__conversationId', 'person')


# Register models with the admin site
admin.site.register(AppUsers)
admin.site.register(Conversation, ConversationAdmin)
admin.site.register(ConversationContent, ConversationContentAdmin)
admin.site.register(Hint, HintAdmin)  
admin.site.register(Language)
admin.site.register(Progress, ProgressAdmin)  