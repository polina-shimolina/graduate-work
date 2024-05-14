# Generated by Django 5.0.4 on 2024-05-14 08:44

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("myapi", "0013_remove_teamphoto_segmented_photo_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="teamphoto",
            name="user_photo",
            field=models.OneToOneField(
                default=1,
                on_delete=django.db.models.deletion.CASCADE,
                to="myapi.userphoto",
            ),
        ),
    ]
