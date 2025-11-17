from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from rest_framework.pagination import PageNumberPagination

from .models import Task, Comment
from .serializers import TaskSerializer, CommentSerializer
from django.contrib.auth import get_user_model

from users.permissions import IsAdmin, IsEmployee  # <-- IMPORT HERE

User = get_user_model()


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.creator == request.user or request.user.role == "admin"


# Pagination
class TaskPagination(PageNumberPagination):
    page_size = 10


# =========================================================
#  TASK LIST + CREATE (Admin only for create)
# =========================================================
class TaskListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        tasks = Task.objects.all().order_by("-created_at")
    
        # 🔒 EMPLOYEE: Only show assigned tasks
        if request.user.role == "employee":
            tasks = tasks.filter(assignee=request.user)
    
        # Optional filters
        status_filter = request.GET.get("status")
        priority_filter = request.GET.get("priority")
        assignee_filter = request.GET.get("assignee")
        search = request.GET.get("search")
    
        if status_filter:
            tasks = tasks.filter(status=status_filter)
        if priority_filter:
            tasks = tasks.filter(priority=priority_filter)
        if assignee_filter and request.user.role == "admin":
            tasks = tasks.filter(assignee=assignee_filter)
        if search:
            tasks = tasks.filter(title__icontains=search)
    
        paginator = TaskPagination()
        paginated = paginator.paginate_queryset(tasks, request)
        serializer = TaskSerializer(paginated, many=True)
    
        return paginator.get_paginated_response(serializer.data)


    def post(self, request):
        # APPLYING ROLE PERMISSION
        if not IsAdmin().has_permission(request, self):
            return Response({"detail": "Only admin can create tasks."}, status=403)

        serializer = TaskSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            task = serializer.save(creator=request.user)
            return Response(TaskSerializer(task).data, status=201)
        return Response(serializer.errors, status=400)


# =========================================================
# TASK DETAIL (Admin or Creator can edit/delete)
# =========================================================
class TaskDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_object(self, pk):
        return get_object_or_404(Task, pk=pk)

    def get(self, request, pk):
        task = self.get_object(pk)
    
        if request.user.role == "employee" and task.assignee != request.user:
            return Response({"detail": "Not allowed to view this task."}, status=403)

        serializer = TaskSerializer(task)
        return Response(serializer.data)


    def put(self, request, pk):
        task = self.get_object(pk)

        # EMPLOYEE – Allowed only if assigned & can update ONLY status
        if request.user.role == "employee":
            if task.assignee != request.user:
                return Response({"detail": "You cannot update this task."}, status=403)

            # Allow only status update
            allowed_fields = {"status"}
            data = {field: value for field, value in request.data.items() if field in allowed_fields}

            serializer = TaskSerializer(task, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)

        # ADMIN — Full update allowed
        self.check_object_permissions(request, task)
        serializer = TaskSerializer(task, data=request.data, partial=True, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    

    def delete(self, request, pk):
        task = self.get_object(pk)
    
        if request.user.role == "employee":
            return Response({"detail": "Employees cannot delete tasks."}, status=403)
    
        self.check_object_permissions(request, task)
        task.delete()
        return Response({"detail": "Task deleted"}, status=204)



# =========================================================
# ASSIGN TASK (Only Admin can assign)
# =========================================================
class AssignTaskView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdmin]  # <-- APPLY ADMIN ONLY

    def post(self, request, pk):
        task = get_object_or_404(Task, pk=pk)
        assignee_id = request.data.get("assignee")

        try:
            user = User.objects.get(pk=assignee_id)
        except User.DoesNotExist:
            return Response({"detail": "User not found"}, status=404)

        # Assign task
        task.assignee = user
        task.status = "in_progress"
        task.save()

        return Response({
            "message": "Task assigned successfully",
            "task": {
                "id": task.id,
                "title": task.title,
                "assignee": task.assignee.id,
                "status": task.status
            }
        }, status=200)


# =========================================================
# COMMENTS (any authenticated user)
# =========================================================
class CommentListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, task_id):
        comments = Comment.objects.filter(task_id=task_id).order_by("created_at")
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    def post(self, request, task_id):
        data = request.data.copy()
        data["task"] = task_id
        serializer = CommentSerializer(data=data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class CommentDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk):
        return get_object_or_404(Comment, pk=pk)

    def put(self, request, pk):
        comment = self.get_object(pk)
        if request.user != comment.author and request.user.role != "admin":
            return Response({"detail": "You cannot edit this comment"}, status=403)

        serializer = CommentSerializer(comment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        comment = self.get_object(pk)
        if request.user != comment.author and request.user.role != "admin":
            return Response({"detail": "You cannot delete this comment"}, status=403)

        comment.delete()
        return Response({"detail": "Comment deleted"}, status=204)
