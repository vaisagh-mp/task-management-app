from django.urls import path
from .views import (
    RegisterView,
    MeView,
    UserUpdateView,
    ChangePasswordView,
    EmployeeListView
)
from .token_views import CustomTokenView

urlpatterns = [
    # Authentication
    path('login/', CustomTokenView.as_view(), name='custom-login'),

    # User CRUD
    path('register/', RegisterView.as_view(), name='user-register'),
    path('me/', MeView.as_view(), name='user-me'),
    path('update/<int:pk>/', UserUpdateView.as_view(), name='user-update'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),

    path("employees/", EmployeeListView.as_view(), name="employee-list"),

]
