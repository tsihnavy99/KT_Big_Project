# Generated by Django 4.2.2 on 2023-07-04 08:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("userinformation", "0018_remove_accountinfo_email"),
    ]

    operations = [
        migrations.AlterField(
            model_name="accountinfo",
            name="user_specialnote",
            field=models.CharField(blank=True, default="", max_length=200),
        ),
    ]