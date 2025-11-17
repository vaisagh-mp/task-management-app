from rest_framework import generics, permissions
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from django.contrib.auth import update_session_auth_hash
from rest_framework.views import APIView
from users.permissions import IsAdmin, IsEmployee 

from .serializers import (
    UserSerializer,
    RegisterSerializer,
)
from .password_serializers import PasswordChangeSerializer

User = get_user_model()


# -----------------------------
# REGISTER
# -----------------------------
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


# -----------------------------
# GET CURRENT USER
# -----------------------------
class MeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


# -----------------------------
# UPDATE USER
# -----------------------------
class UserUpdateView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # admin can update anyone
        if self.request.user.role == "admin":
            return User.objects.get(pk=self.kwargs["pk"])

        # employee can update only themselves
        return self.request.user


# -----------------------------
# CHANGE PASSWORD
# -----------------------------
class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = PasswordChangeSerializer
    model = User
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            if not user.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Wrong password"]}, status=400)

            user.set_password(serializer.data.get("new_password"))
            user.save()
            update_session_auth_hash(request, user)

            return Response({"detail": "Password updated successfully"})

        return Response(serializer.errors, status=400)



class EmployeeListView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get(self, request):
        employees = User.objects.filter(role="employee")
        data = UserSerializer(employees, many=True).data
        return Response(data)
