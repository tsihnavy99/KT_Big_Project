from django.contrib import admin
from . import models

# Register your models here.
class PostAdmin(admin.ModelAdmin):
    list_display = ['user_id', 'pill_name']
    list_display_links = ['user_id', 'pill_name']

admin.site.register(models.user_pill, PostAdmin)