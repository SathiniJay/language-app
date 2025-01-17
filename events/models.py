from django.db import models

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



