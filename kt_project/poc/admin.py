from django.contrib import admin
from . import models

# Register your models here.

class PostAdmin(admin.ModelAdmin):
    list_display = ['제품명A', '제품명B', '업체명A', '업체명B']
    list_display_links = ['제품명A', '제품명B', '업체명A', '업체명B']

admin.site.register(models.Prohibition_Of_Combination, PostAdmin)