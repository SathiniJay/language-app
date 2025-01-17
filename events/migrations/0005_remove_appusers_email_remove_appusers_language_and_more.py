# Generated by Django 5.0.7 on 2024-09-22 23:40

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("events", "0004_remove_appusers_emailaddress_remove_appusers_id_and_more"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="appusers",
            name="email",
        ),
        migrations.RemoveField(
            model_name="appusers",
            name="language",
        ),
        migrations.AddField(
            model_name="appusers",
            name="emailAddress",
            field=models.EmailField(
                default=django.utils.timezone.now,
                max_length=254,
                verbose_name="User Email",
            ),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="appusers",
            name="id",
            field=models.BigAutoField(
                auto_created=True,
                default=1,
                primary_key=True,
                serialize=False,
                verbose_name="ID",
            ),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="appusers",
            name="joinDate",
            field=models.DateTimeField(
                default=django.utils.timezone.now, verbose_name="Join Date"
            ),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="appusers",
            name="languageId",
            field=models.CharField(default=1, max_length=1, verbose_name="Language ID"),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="appusers",
            name="level",
            field=models.CharField(default=1, max_length=1, verbose_name="Level"),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="appusers",
            name="name",
            field=models.CharField(
                default="yasiru", max_length=50, verbose_name="Name"
            ),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="appusers",
            name="userId",
            field=models.CharField(default=1, max_length=1, verbose_name="User ID"),
            preserve_default=False,
        ),
    ]
