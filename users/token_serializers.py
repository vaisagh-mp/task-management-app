from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["username"] = user.username
        token["role"] = user.role
        return token

    def validate(self, attrs):
        username_or_email = attrs.get("username")
        password = attrs.get("password")

        user = None

        # Login using username
        if User.objects.filter(username=username_or_email).exists():
            user = authenticate(username=username_or_email, password=password)
        # Login using email
        elif User.objects.filter(email=username_or_email).exists():
            username_match = User.objects.get(email=username_or_email).username
            user = authenticate(username=username_match, password=password)

        if not user:
            raise serializers.ValidationError("Invalid username/email or password")

        refresh = self.get_token(user)

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
        }
