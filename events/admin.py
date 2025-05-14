from django.contrib import admin
from import_export import resources
from import_export.admin import ImportExportModelAdmin

from .models import AppUsers, Conversation, ConversationContent, Hint, Language, Progress, InfoGapExercise, InfoGapListDeliContent, InfoGapMapTownCentreContent, InfoGapMatricesInterviewContent, InfoGapSession, InfoGapHint

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

# Define a resource class for the InfoGapExercise model
class InfoGapExerciseResource(resources.ModelResource):
    class Meta:
        model = InfoGapExercise
        fields = (
            'id',
            'infoGapExerciseId',
            'infoGapExerciseType',
            'infoGapExerciseLevel',
            'context',
            'scenario',
            'nativeLanguageId',
            'learningLanguageId'
        )
        import_id_fields = ['id']

# Define an admin class for InfoGapExercise to enable import/export functionality
class InfoGapExerciseAdmin(ImportExportModelAdmin):
    resource_class = ConversationResource
    list_display = ('infoGapExerciseId', 'infoGapExerciseType', 'infoGapExerciseLevel', 'context', 'scenario')
    search_fields = ('infoGapExerciseId', 'infoGapExerciseType', 'context', 'scenario')

# Define a resource class for the InfoGapListDeliContent model
class InfoGapListDeliContentResource(resources.ModelResource):
    class Meta:
        model = InfoGapListDeliContent
        fields = (
            'id',
            'infoGapListDeliContentId',
            'infoGapExerciseId__infoGapExerciseId',
            'item_name',
            'correct_price',
            'correct_quantity',
            'price_options',
            'quantity_options'
        )
        import_id_fields = ['infoGapListDeliContentId']

# Define an admin class for InfoGapListDeliContent to enable import/export functionality
class InfoGapListDeliContentAdmin(ImportExportModelAdmin):
    resource_class = InfoGapListDeliContentResource
    list_display = (
        'infoGapListDeliContentId',
        'infoGapExerciseId',
        'item_name',
        'correct_price',
        'correct_quantity',
        'price_options',
        'quantity_options'
    )
    search_fields = (
        'infoGapListDeliContentId',
        'infoGapExerciseId__infoGapExerciseId',
        'item_name',
        'correct_price',
        'correct_quantity'
    )

# Define a resource class for the InfoGapMapTownCentreContent model
class InfoGapMapTownCentreContentResource(resources.ModelResource):
    class Meta:
        model = InfoGapMapTownCentreContent
        fields = (
            'id',
            'infoGapMapTownCentreContentId',
            'infoGapExerciseId__infoGapExerciseId',
            'row',
            'col',
            'correct_place',
            'is_blank'
        )
        import_id_fields = ['infoGapMapTownCentreContentId']

# Define an admin class for InfoGapMapTownCentreContent to enable import/export functionality
class InfoGapMapTownCentreContentAdmin(ImportExportModelAdmin):
    resource_class = InfoGapMapTownCentreContentResource
    list_display = (
        'infoGapMapTownCentreContentId',
        'infoGapExerciseId',
        'row',
        'col',
        'correct_place',
        'is_blank'
    )
    search_fields = (
        'infoGapMapTownCentreContentId',
        'infoGapExerciseId__infoGapExerciseId',
        'correct_place'
    )

# Define a resource class for the InfoGapMatricesInterviewContent model
class InfoGapMatricesInterviewContentResource(resources.ModelResource):
    class Meta:
        model = InfoGapMatricesInterviewContent
        fields = (
            'id',
            'infoGapMatricesInterviewContentId',
            'infoGapExerciseId__infoGapExerciseId',
            'label',
            'correct_name',
            'prompt',
            'person'
        )
        import_id_fields = ['infoGapMatricesInterviewContentId']

# Define an admin class for InfoGapMatricesInterviewContent to enable import/export functionality
class InfoGapMatricesInterviewContentAdmin(ImportExportModelAdmin):
    resource_class = InfoGapMatricesInterviewContentResource
    list_display = (
        'infoGapMatricesInterviewContentId',
        'infoGapExerciseId',
        'label',
        'correct_name',
        'prompt',
        'person'
    )
    search_fields = (
        'infoGapMatricesInterviewContentId',
        'infoGapExerciseId__infoGapExerciseId',
        'correct_name',
        'label'
    )

# Define a resource class for the Info Gap Hint model
class InfoGapHintResource(resources.ModelResource):
    class Meta:
        model = InfoGapHint
        fields = ('id', 'infoGapExerciseId', 'word', 'spanish', 'chinese', 'italian','german', 'french', 'arabic','russian', 'japanese')  # Adjust fields as needed
        import_id_fields = ['id']

# Define an admin class for Info Gap Hint to enable import/export functionality
class InfoGapHintAdmin(ImportExportModelAdmin):
    resource_class = InfoGapHintResource
    list_display = ('id', 'infoGapExerciseId', 'word', 'spanish', 'chinese', 'italian','german', 'french', 'arabic','russian', 'japanese')  # Adjust display fields as needed
    search_fields = ( 'word') 

    

# Register models with the admin site
admin.site.register(AppUsers)
admin.site.register(Conversation, ConversationAdmin)
admin.site.register(ConversationContent, ConversationContentAdmin)
admin.site.register(Hint, HintAdmin)  
admin.site.register(Language)
admin.site.register(Progress, ProgressAdmin)  
admin.site.register(InfoGapExercise, InfoGapExerciseAdmin)
admin.site.register(InfoGapListDeliContent, InfoGapListDeliContentAdmin)
admin.site.register(InfoGapMapTownCentreContent, InfoGapMapTownCentreContentAdmin)
admin.site.register(InfoGapMatricesInterviewContent, InfoGapMatricesInterviewContentAdmin)
admin.site.register(InfoGapSession)
admin.site.register(InfoGapHint)
