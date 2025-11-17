from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from .models import Task
from django.contrib.auth import get_user_model

@shared_task
def send_task_assigned_email(task_id):
    try:
        task = Task.objects.get(id=task_id)
        if task.assignee and task.assignee.email:
            send_mail(
                subject=f"You have been assigned: {task.title}",
                message=f"Task: {task.title}\nDescription: {task.description}\nDue: {task.due_date}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[task.assignee.email],
                fail_silently=True,
            )
    except Task.DoesNotExist:
        return