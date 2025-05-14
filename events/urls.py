from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AppUsersViewSet, ConversationViewSet, ConversationContentViewSet, LanguageViewSet, HintViewSet, ProgressViewSet, progress_view, InfoGapExerciseViewSet, InfoGapListDeliContentViewSet, InfoGapMapTownCentreContentViewSet, InfoGapMatricesInterviewContentViewSet, create_session, join_session, session_status, get_info_gap_hints, mark_completed

router = DefaultRouter()
router.register(r'appusers', AppUsersViewSet)  
router.register(r'conversations', ConversationViewSet)
router.register(r'conversationcontents', ConversationContentViewSet)
router.register(r'languages', LanguageViewSet)
router.register(r'hints', HintViewSet)
router.register(r'progress', ProgressViewSet)
router.register(r'infoGapExercise', InfoGapExerciseViewSet)
router.register(r'InfoGapListDeliContent', InfoGapListDeliContentViewSet)
router.register(r'InfoGapMapTownCentreContent', InfoGapMapTownCentreContentViewSet)
router.register(r'InfoGapMatricesInterviewContent', InfoGapMatricesInterviewContentViewSet)

urlpatterns = [
    # Email-based route for AppUsers
    path('appusers/email/<str:email>/', AppUsersViewSet.as_view({'get': 'retrieve', 'put': 'update'}), name='appusers-email'),
    path('progress/', progress_view, name='save_progress'),
    
    # Session creation route (called by Person A)
    path('create-session/', create_session, name='create_session'),
    
    # Join session route (called by Person B)
    path('join-session/', join_session, name='join_session'),

    # Polling endpoint to check if both persons have joined
    path('sessions/<str:session_code>/status/', session_status, name='session_status'),

    # Endpoint to mark exercise completion per person, and check if both are done
    path("mark-completed/", mark_completed, name="mark_completed"),

    # Endpoint to fetch vocabulary hints for infogap exercises
    path('infoGapHints/', get_info_gap_hints),

    # Include the router URLs
    path('', include(router.urls)),
]
