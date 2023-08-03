from django.contrib import admin
from . import models

# Register your models here.


class PostAdmin(admin.ModelAdmin):
    list_display = ['no', 'question', 'answer']
    list_display_links = ['no','question', 'answer']

admin.site.register(models.qna, PostAdmin)