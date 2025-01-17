from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AppUsersViewSet, ConversationViewSet, ConversationContentViewSet, LanguageViewSet, HintViewSet, ProgressViewSet, progress_view

router = DefaultRouter()
router.register(r'appusers', AppUsersViewSet)  
router.register(r'conversations', ConversationViewSet)
router.register(r'conversationcontents', ConversationContentViewSet)
router.register(r'languages', LanguageViewSet)
router.register(r'hints', HintViewSet)
router.register(r'progress', ProgressViewSet)

urlpatterns = [
    # Email-based route for AppUsers
    path('appusers/email/<str:email>/', AppUsersViewSet.as_view({'get': 'retrieve', 'put': 'update'}), name='appusers-email'),
    path('progress/', progress_view, name='save_progress'),
    
    # Include the router URLs
    path('', include(router.urls)),
]
