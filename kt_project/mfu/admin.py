from django.contrib import admin
from . import models

# Register your models here.
class PostAdmin(admin.ModelAdmin):
    list_display = ['id', '제품명A']
    list_display_links = ['id', '제품명A']

admin.site.register(models.Medications_For_Use_Of, PostAdmin)