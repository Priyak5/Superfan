# Generated by Django 4.1.3 on 2022-12-03 23:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_user_profile_pic'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='profile_pic',
        ),
    ]
