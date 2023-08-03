from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('qna', '0003_alter_qna_답변'),
    ]

    operations = [
        migrations.AlterField(
            model_name='qna',
            name='질문',
            field=models.CharField(max_length=100),
        ),
    ]
