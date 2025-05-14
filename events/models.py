from django.db import models
import random
import string


class AppUsers(models.Model):
    emailAddress = models.EmailField('User Email', max_length=30, unique=True)
    languageId = models.ForeignKey('Language', on_delete=models.CASCADE, null=True, related_name='users')
    birthDate = models.DateField(null=True, blank=True)  

    def __str__(self):
        return self.emailAddress

class Conversation(models.Model):
    conversationId = models.CharField('Conversation ID', max_length=2, unique=True)
    conversationLevel = models.CharField('Conversation Level', max_length=2)
    context = models.CharField('Context', max_length=50)
    scenario = models.CharField('Scenario', max_length=30)
    nativeLanguageId = models.CharField('Native Language ID', max_length=1)
    learningLanguageId = models.CharField('Learning Language ID', max_length=1)
    
    def __str__(self):
        return self.conversationId
    
class ConversationContent(models.Model):
    contentId = models.CharField('Content ID', max_length=3, unique=True)
    conversationId = models.ForeignKey(Conversation, on_delete=models.CASCADE, blank=True, null=True, related_name='contents')
    person = models.CharField('Person', max_length=1)
    line = models.CharField('Line', max_length=300)
    prompt = models.CharField('Prompt', max_length=300)

    def __str__(self):
        return self.contentId
    
class Language(models.Model):
    languageId = models.IntegerField('language Id')
    languageName = models.CharField('language Name', max_length=15)
    
    def __str__(self):
        return self.languageName
    
class Hint(models.Model):
    hintId = models.CharField('Hint ID', max_length=3, unique=True)
    contentId = models.ForeignKey(ConversationContent, on_delete=models.CASCADE, blank=True, null=True, related_name='hints')
    word = models.CharField('Word', max_length=40)
    spanish = models.CharField('Spanish', max_length=50)
    chinese = models.CharField('Chinese', max_length=50)
    italian = models.CharField('Italian', max_length=50)
    german = models.CharField('German', max_length=50)
    french = models.CharField('French', max_length=50)
    arabic = models.CharField('Arabic', max_length=50)
    russian = models.CharField('Russian', max_length=50)
    japanese = models.CharField('Japanese', max_length=50)
    
    def __str__(self):
        return self.hintId
    
class Progress(models.Model):
    user = models.ForeignKey(AppUsers, on_delete=models.CASCADE, related_name='progress')
    language = models.ForeignKey(Language, on_delete=models.CASCADE, related_name='progress') 
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='progress')
    person = models.CharField('Person', max_length=1)  
    completed_times = models.PositiveIntegerField(default=0) 

    def __str__(self):
        return f"{self.user.emailAddress} - {self.conversation.conversationId} ({self.person}) in {self.language.languageName}"


# Master model that defines the information gap exercise
class InfoGapExercise(models.Model):
    infoGapExerciseId = models.CharField('Info Gap Exercise ID', max_length=2, unique=True)
    infoGapExerciseType = models.CharField('Info Gap Exercise Type', max_length=50)
    infoGapExerciseLevel = models.CharField('Info Gap Exercise Level', max_length=2)
    context = models.CharField('Context', max_length=50)
    scenario = models.CharField('Scenario', max_length=30)
    nativeLanguageId = models.CharField('Native Language ID', max_length=1)
    learningLanguageId = models.CharField('Learning Language ID', max_length=1)
    
    def __str__(self):
        return self.infoGapExerciseId
    
# Content for the Information Gap List (Grocery Deli scenario)
class InfoGapListDeliContent(models.Model):
    infoGapListDeliContentId = models.CharField('info Gap List Deli Content ID', max_length=3, unique=True)
    infoGapExerciseId = models.ForeignKey(InfoGapExercise, on_delete=models.CASCADE, blank=True, null=True)
    item_name = models.CharField(max_length=100)
    correct_price = models.CharField(max_length=20)
    correct_quantity = models.CharField(max_length=50)
    price_options = models.JSONField()
    quantity_options = models.JSONField()

    def __str__(self):
        return self.infoGapListDeliContentId
    
# Content for the Information Gap Map (Town Centre map scenario)
class InfoGapMapTownCentreContent(models.Model):
    infoGapMapTownCentreContentId = models.CharField('info Gap Map Town Centre Content ID', max_length=3, unique=True) 
    infoGapExerciseId = models.ForeignKey(InfoGapExercise, on_delete=models.CASCADE, blank=True, null=True) 
    row = models.IntegerField()
    col = models.IntegerField()
    correct_place = models.CharField(max_length=100)
    is_blank = models.BooleanField()

    def __str__(self):
        return self.infoGapMapTownCentreContentId
    
# Content for the Information Gap Matrices (Interview scenario)
class InfoGapMatricesInterviewContent(models.Model):
    infoGapMatricesInterviewContentId = models.CharField('Info Gap Matrices Interview Content ID', max_length=3, unique=True)
    infoGapExerciseId = models.ForeignKey(InfoGapExercise, on_delete=models.CASCADE, blank=True, null=True)
    label = models.CharField(max_length=100)            # e.g., "Internship"
    correct_name = models.CharField(max_length=100)     # e.g., "John"
    prompt = models.TextField()                         # e.g., "John completed an internship."
    person = models.CharField(max_length=1)             # e.g., "A" or "B"

    def __str__(self):
        return self.infoGapMatricesInterviewContentId
    
# Model to manage two-person sessions for synchronised exercises
class InfoGapSession(models.Model):
    session_code = models.CharField(max_length=10, unique=True)
    exercise = models.ForeignKey(InfoGapExercise, on_delete=models.CASCADE, related_name="sessions")
    person_a_joined = models.BooleanField(default=False)
    person_b_joined = models.BooleanField(default=False)
    person_a_completed = models.BooleanField(default=False) 
    person_b_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Session {self.session_code} for Exercise {self.exercise.infoGapExerciseId}"

# Multilingual vocabulary hints for Information Gap exercises
class InfoGapHint(models.Model):
    infoGapExerciseId = models.ForeignKey('InfoGapExercise', on_delete=models.CASCADE, related_name='hints')
    word = models.CharField('Word', max_length=40)
    spanish = models.CharField('Spanish', max_length=50, blank=True)
    chinese = models.CharField('Chinese', max_length=50, blank=True)
    italian = models.CharField('Italian', max_length=50, blank=True)
    german = models.CharField('German', max_length=50, blank=True)
    french = models.CharField('French', max_length=50, blank=True)
    arabic = models.CharField('Arabic', max_length=50, blank=True)
    russian = models.CharField('Russian', max_length=50, blank=True)
    japanese = models.CharField('Japanese', max_length=50, blank=True)

    def __str__(self):
        return f"{self.word} - {self.infoGapExerciseId}"
