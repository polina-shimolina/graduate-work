# Generated by Django 4.2.6 on 2023-10-24 19:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("myapi", "0003_alter_photo_path_to_file"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="photo",
            name="class_name",
        ),
        migrations.RemoveField(
            model_name="photo",
            name="path_to_file",
        ),
        migrations.AddField(
            model_name="photo",
            name="image",
            field=models.ImageField(default="default_image.jpg", upload_to=""),
        ),
    ]
