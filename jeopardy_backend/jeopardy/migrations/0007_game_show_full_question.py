# Generated by Django 3.1.4 on 2020-12-20 04:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jeopardy', '0006_remove_question_is_buzzed_on'),
    ]

    operations = [
        migrations.AddField(
            model_name='game',
            name='show_full_question',
            field=models.BooleanField(default=False),
        ),
    ]
