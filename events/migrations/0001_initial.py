# Generated by Django 5.0.7 on 2024-07-30 19:31

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="AppUsers",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("userId", models.CharField(max_length=1, verbose_name="User ID")),
                ("name", models.CharField(max_length=50, verbose_name="Name")),
                ("level", models.CharField(max_length=1, verbose_name="Level")),
                (
                    "emailAddress",
                    models.EmailField(max_length=254, verbose_name="User Email"),
                ),
                ("joinDate", models.DateTimeField(verbose_name="Join Date")),
                (
                    "languageId",
                    models.CharField(max_length=1, verbose_name="Language ID"),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Conversation",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "conversationId",
                    models.CharField(
                        max_length=1, unique=True, verbose_name="Conversation ID"
                    ),
                ),
                (
                    "conversationLevel",
                    models.CharField(max_length=2, verbose_name="Conversation Level"),
                ),
                ("context", models.CharField(max_length=50, verbose_name="Context")),
                ("scenario", models.CharField(max_length=30, verbose_name="Scenario")),
                (
                    "nativeLanguageId",
                    models.CharField(max_length=1, verbose_name="Native Language ID"),
                ),
                (
                    "learningLanguageId",
                    models.CharField(max_length=1, verbose_name="Learning Language ID"),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Language",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "languageId",
                    models.CharField(max_length=1, verbose_name="language Id"),
                ),
                (
                    "languageName",
                    models.CharField(max_length=15, verbose_name="language Name"),
                ),
            ],
        ),
        migrations.CreateModel(
            name="ConversationContent",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "contentId",
                    models.CharField(
                        max_length=1, unique=True, verbose_name="Content ID"
                    ),
                ),
                ("person", models.CharField(max_length=1, verbose_name="Person")),
                ("line", models.CharField(max_length=300, verbose_name="Line")),
                (
                    "conversationId",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="contents",
                        to="events.conversation",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Hint",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "hintId",
                    models.CharField(max_length=1, unique=True, verbose_name="Hint ID"),
                ),
                ("word", models.CharField(max_length=20, verbose_name="Word")),
                (
                    "targetLanguage",
                    models.CharField(max_length=15, verbose_name="Target Language"),
                ),
                (
                    "targetLanguageId",
                    models.CharField(
                        max_length=30, verbose_name="Target Language Word"
                    ),
                ),
                (
                    "contentId",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="hints",
                        to="events.conversationcontent",
                    ),
                ),
                (
                    "conversationId",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="hints",
                        to="events.conversation",
                    ),
                ),
                (
                    "scenario",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="hint_scenarios",
                        to="events.conversation",
                    ),
                ),
                (
                    "language",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="hints",
                        to="events.language",
                    ),
                ),
            ],
        ),
    ]