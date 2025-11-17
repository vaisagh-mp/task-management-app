from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


class UserAdmin(BaseUserAdmin):

    # Fields displayed in list view
    list_display = ("username", "email", "role", "is_active", "is_staff", "date_joined")

    # Searchable fields
    search_fields = ("username", "email", "role")

    # Filters on right side
    list_filter = ("role", "is_staff", "is_superuser", "is_active")

    # Fields shown when creating/editing a user
    fieldsets = (
        ("Login Credentials", {"fields": ("username", "password")}),
        ("Personal Info", {"fields": ("first_name", "last_name", "email")}),
        ("Role & Permissions", {"fields": ("role", "is_staff", "is_superuser", "is_active")}),
        ("Important Dates", {"fields": ("last_login", "date_joined")}),
        ("Groups and Permissions", {"fields": ("groups", "user_permissions")}),
    )

    # For "Add User" form
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("username", "email", "role", "password1", "password2"),
            },
        ),
    )

    ordering = ("id",)


admin.site.register(User, UserAdmin)
