# Generated by Django 4.2.1 on 2023-06-08 07:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('qna', '0002_remove_qna_id_alter_qna_no_alter_qna_user_info'),
    ]

    operations = [
        migrations.AlterField(
            model_name='qna',
            name='답변',
            field=models.CharField(default='', max_length=100),
        ),
    ]
