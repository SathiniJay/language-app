
from django.contrib import admin
from django.urls import path, include, re_path
from . import views

urlpatterns = [
    path("admin/", admin.site.urls),
    path('api/', include('events.urls')),
    path('api/accounts/', include('accounts.urls')),
    path('test/', views.index, name='test'),
    path('convTest/', views.index, name='conversationTest'),
    path('', views.index, name='index'),
    path('info/', views.index, name='info'),
    path('login/', views.index, name='login'),
    path('signup/', views.index, name='signup'),
    path('home/', views.index, name='index'),
    path('profile/', views.index, name='profile'),
    path('language/', views.index, name='language'),
    path('activity-selection/', views.index, name='activity_selection'),
    path('activity-selection/conversations', views.index, name='conversations'),
    path('activity-selection/information-gap', views.index, name='information_gap'),
    path('activity-selection/conversation-page', views.index, name='conversation_page'),
    path('progress/', views.index, name='progress'),
    path('settings/', views.index, name='settings'),
    path('logout/', views.index, name='logout'),
    path('forgot-password/', views.index, name='forgot_password'),
]
