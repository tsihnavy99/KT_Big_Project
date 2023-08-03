from django.contrib import admin
from . import models

# Register your models here.
class PostAdmin(admin.ModelAdmin):
    list_display = ['뉴스']
    list_display_links = ['뉴스']

admin.site.register(models.news, PostAdmin)