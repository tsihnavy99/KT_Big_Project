from django.contrib import admin
from . import models

# Register your models here.
class PostAdmin(admin.ModelAdmin):
    list_display = ['admin', '건수', '조합']
    list_display_links = ['admin', '건수', '조합']

admin.site.register(models.Detection_record, PostAdmin)

