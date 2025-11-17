from django.contrib import admin
from .models import Task, Comment


# -----------------------------
# Inline Comments for Task Page
# -----------------------------
class CommentInline(admin.TabularInline):
    model = Comment
    extra = 0
    readonly_fields = ("author", "content", "created_at")


# -----------------------------
# Task Admin Configuration
# -----------------------------
@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "creator",
        "assignee",
        "status",
        "priority",
        "due_date",
        "created_at",
        "updated_at",
    )

    list_filter = (
        "status",
        "priority",
        "creator",
        "assignee",
    )

    search_fields = (
        "title",
        "description",
        "creator__username",
        "assignee__username",
    )

    ordering = ("-created_at",)

    readonly_fields = ("created_at", "updated_at")

    inlines = [CommentInline]


# -----------------------------
# Comment Admin
# -----------------------------
@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("task", "author", "content", "created_at")
    list_filter = ("author", "task")
    search_fields = ("content", "author__username", "task__title")
    readonly_fields = ("created_at",)
