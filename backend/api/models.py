from django.db import models

class Story(models.Model):
    prompt = models.TextField()
    story = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
