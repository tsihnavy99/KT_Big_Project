from django.contrib import admin
from . import models

# Register your models here.
class PostAdmin(admin.ModelAdmin):
    list_display = ['id', 'email']
    list_display_links = ['id', 'email']

admin.site.register(models.user_info, PostAdmin)