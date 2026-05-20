from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from pydantic import BaseModel

from typing import Optional

from app.db.database import (
    get_db
)

from app.models.task import (
    Task
)

from app.models.user import (
    User
)

from app.models.workspace_member import (
    WorkspaceMember
)

from app.auth.jwt_handler import (
    get_current_user
)

from app.services.activity_service import (
    create_activity
)

from app.services.notification_service import (
    create_notification
)

import asyncio


router = APIRouter(

    prefix="/tasks",

    tags=["Tasks"]
)


# =========================
# SCHEMAS
# =========================

class TaskCreate(BaseModel):

    title: str

    description: str

    priority: str

    workspace_id: int

    due_date: Optional[str] = None


class TaskStatusUpdate(BaseModel):

    status: str


class AssignTaskSchema(BaseModel):

    assigned_to: int


# =========================
# CREATE TASK
# =========================

@router.post("/create")
def create_task(

    task: TaskCreate,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    )
):

    new_task = Task(

        title=task.title,

        description=task.description,

        priority=task.priority,

        status="todo",

        workspace_id=task.workspace_id,

        due_date=task.due_date
    )

    db.add(new_task)

    db.commit()

    db.refresh(new_task)


    # ACTIVITY
    asyncio.create_task(

        create_activity(

            db,

            task.workspace_id,

            current_user.name,

            f"created task '{task.title}'"
        )
    )

    return new_task


# =========================
# GET TASKS
# =========================

@router.get("/{workspace_id}")
def get_tasks(

    workspace_id: int,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    )
):

    tasks = db.query(
        Task
    ).filter(

        Task.workspace_id
        == workspace_id

    ).all()


    result = []


    for task in tasks:

        assigned_user = None


        if task.assigned_to:

            user = db.query(User).filter(
                User.id == task.assigned_to
            ).first()


            if user:

                assigned_user = {

                    "id": user.id,

                    "name": user.name
                }


        result.append({

            "id": task.id,

            "title": task.title,

            "description": task.description,

            "priority": task.priority,

            "status": task.status,

            "workspace_id":
                task.workspace_id,

            "assigned_to":
                task.assigned_to,

            "assigned_user":
                assigned_user,

            "due_date":
                task.due_date
        })


    return result


# =========================
# UPDATE TASK STATUS
# =========================

@router.put("/{task_id}/status")
def update_task_status(

    task_id: int,

    data: TaskStatusUpdate,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    )
):

    task = db.query(Task).filter(
        Task.id == task_id
    ).first()


    if not task:

        raise HTTPException(

            status_code=404,

            detail="Task not found"
        )


    task.status = data.status

    db.commit()

    db.refresh(task)


    # ACTIVITY
    asyncio.create_task(

        create_activity(

            db,

            task.workspace_id,

            current_user.name,

            f"moved task '{task.title}' to {task.status}"
        )
    )

    return task


# =========================
# ASSIGN TASK
# =========================

@router.put("/{task_id}/assign")
def assign_task(

    task_id: int,

    data: AssignTaskSchema,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    )
):

    task = db.query(Task).filter(
        Task.id == task_id
    ).first()


    if not task:

        raise HTTPException(

            status_code=404,

            detail="Task not found"
        )


    # CHECK MEMBER
    member = db.query(
        WorkspaceMember
    ).filter(

        WorkspaceMember.workspace_id
        == task.workspace_id,

        WorkspaceMember.user_id
        == data.assigned_to

    ).first()


    if not member:

        raise HTTPException(

            status_code=400,

            detail=
            "User not in workspace"
        )


    task.assigned_to = data.assigned_to

    db.commit()

    db.refresh(task)


    assigned_user = db.query(User).filter(
        User.id == data.assigned_to
    ).first()


    # NOTIFICATION
    asyncio.create_task(

        create_notification(

            db,

            assigned_user.id,

            task.workspace_id,

            "Task Assigned",

            f"You were assigned to '{task.title}'"
        )
    )


    # ACTIVITY
    asyncio.create_task(

        create_activity(

            db,

            task.workspace_id,

            current_user.name,

            f"assigned '{task.title}' to {assigned_user.name}"
        )
    )


    return {

        "id": task.id,

        "title": task.title,

        "description": task.description,

        "priority": task.priority,

        "status": task.status,

        "workspace_id":
            task.workspace_id,

        "assigned_to":
            task.assigned_to,

        "assigned_user": {

            "id":
                assigned_user.id,

            "name":
                assigned_user.name
        },

        "due_date":
            task.due_date
    }