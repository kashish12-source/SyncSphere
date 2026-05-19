from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session
from app.models.notification import Notification

from app.db.session import get_db

from app.models.task import Task
from app.models.workspace_member import WorkspaceMember
from app.models.user import User
from app.websocket.manager import manager

from app.schemas.task_schema import (
    TaskCreate,
    TaskUpdate
)

from app.auth.oauth2 import get_current_user


router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"]
)


# CREATE TASK
@router.post("/create")
async def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # CHECK USER BELONGS TO WORKSPACE
    membership = db.query(
        WorkspaceMember
    ).filter(
        WorkspaceMember.workspace_id == task.workspace_id,
        WorkspaceMember.user_id == current_user.id
    ).first()

    if not membership:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    new_task = Task(
        title=task.title,
        description=task.description,
        priority=task.priority,
        deadline=task.deadline,
        workspace_id=task.workspace_id,
        assigned_to=task.assigned_to,
        created_by=current_user.id
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    # CREATE NOTIFICATION
    notification = Notification(
        user_id=task.assigned_to,
        message=f"You were assigned task: {task.title}"
    )

    db.add(notification)
    db.commit()
    await manager.send_personal_message(
        task.assigned_to,
        {
            "event": "notification",
            "message": f"You were assigned task: {task.title}"
        }
    )
    await manager.broadcast_to_workspace(
        task.workspace_id,
        {
            "event": "task_created",
            "task": {
                "id": new_task.id,
                "title": new_task.title,
                "description": new_task.description,
                "priority": new_task.priority,
                "status": new_task.status,
                "workspace_id": new_task.workspace_id
            }
        }
    )

    return {
        "message": "Task created successfully",
        "task_id": new_task.id
    }


# GET WORKSPACE TASKS
@router.get("/{workspace_id}")
def get_workspace_tasks(
    workspace_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    membership = db.query(
        WorkspaceMember
    ).filter(
        WorkspaceMember.workspace_id == workspace_id,
        WorkspaceMember.user_id == current_user.id
    ).first()

    if not membership:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    tasks = db.query(Task).filter(
        Task.workspace_id == workspace_id
    ).all()

    return tasks


# UPDATE TASK
@router.put("/{task_id}")
async def update_task(
    task_id: int,
    task_update: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    task = db.query(Task).filter(
        Task.id == task_id
    ).first()

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    membership = db.query(
        WorkspaceMember
    ).filter(
        WorkspaceMember.workspace_id == task.workspace_id,
        WorkspaceMember.user_id == current_user.id
    ).first()

    if not membership:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    update_data = task_update.dict(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(task, key, value)

    db.commit()
    db.refresh(task)

    await manager.broadcast_to_workspace(
        task.workspace_id,
        {
            "event": "task_updated",
            "task": {
                "id": task.id,
                "title": task.title,
                "status": task.status,
                "priority": task.priority
            }
        }
    )

    return {
        "message": "Task updated successfully"
    }


# DELETE TASK
@router.delete("/{task_id}")
async def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    task = db.query(Task).filter(
        Task.id == task_id
    ).first()

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    membership = db.query(
        WorkspaceMember
    ).filter(
        WorkspaceMember.workspace_id == task.workspace_id,
        WorkspaceMember.user_id == current_user.id
    ).first()

    if not membership:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )
    workspace_id = task.workspace_id
    task_id = task.id

    db.delete(task)
    db.commit()
    await manager.broadcast_to_workspace(
        workspace_id,
        {
            "event": "task_deleted",
            "task_id": task_id
        }
    )

    return {
        "message": "Task deleted successfully"
    }