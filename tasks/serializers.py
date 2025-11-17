from rest_framework import serializers
from .models import Task, Comment
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','username','email')

class CommentSerializer(serializers.ModelSerializer):
    author = UserSimpleSerializer(read_only=True)
    class Meta:
        model = Comment
        fields = ('id','task','author','content','created_at')
        read_only_fields = ('author','created_at')

class TaskSerializer(serializers.ModelSerializer):
    creator = UserSimpleSerializer(read_only=True)
    assignee = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), allow_null=True, required=False)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Task
        fields = ('id','title','description','creator','assignee','status','priority','due_date','created_at','updated_at','comments')

    def create(self, validated_data):
        request = self.context['request']
        validated_data['creator'] = request.user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)