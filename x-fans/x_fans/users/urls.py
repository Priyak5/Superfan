

from django.contrib import admin
from django.urls import path

from . import views

urlpatterns = [
    path('login/', views.CreateUserView.as_view()),
    path('profile/name/', views.UpdateName.as_view()),
    path("profile/", views.UpdateProfile.as_view()),
    path("profile/<int:user_id>/", views.GetProfileDetails.as_view()),
    path("search/", views.SearchUserView.as_view()),
    path("media/", views.UploadMedia.as_view()),
]