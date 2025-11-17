from django.urls import path
from .views import (
    TaskListCreateView,
    TaskDetailView,
    AssignTaskView,
    CommentListCreateView,
    CommentDetailView
)

urlpatterns = [
    # Tasks
    path('', TaskListCreateView.as_view(), name='task-list'),
    path('<int:pk>/', TaskDetailView.as_view(), name='task-detail'),
    path('<int:pk>/assign/', AssignTaskView.as_view(), name='task-assign'),

    # Comments
    path('<int:task_id>/comments/', CommentListCreateView.as_view(), name='comment-list'),
    path('comments/<int:pk>/', CommentDetailView.as_view(), name='comment-detail'),
]
