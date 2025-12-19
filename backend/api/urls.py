from django.urls import path
from .views import generate_story_api

urlpatterns = [
    path("generate-story/", generate_story_api),
]
