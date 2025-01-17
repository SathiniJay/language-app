from django.urls import path
from .views import login_user, register_user, user_profile

urlpatterns = [
    path('login/', login_user),
    path('register/', register_user),
    path('profile/', user_profile, name='user-profile'), 
]
