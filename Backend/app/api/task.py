from fastapi import(    APIRouter,
    Depends,
    HTTPException,
    BackgroundTasks
)

from sqlalchemy.orm import Session

from app.db.database import (
    get_db
)

from app.models.task import (
    Task
)

from app.models.user import (
    User
)
from app.models.activity import (
    Activity
)

from app.schemas.task import (
    TaskCreate
)

from app.auth.jwt_handler import (
    get_current_user
)

from app.websocket.manager import (
    manager
)

import asyncio


router = APIRouter(

    prefix="/tasks",

    tags=["Tasks"]
)


# =========================
# CREATE TASK
# =========================

@router.post("/create")
def create_task(

    task: TaskCreate,

    background_tasks: BackgroundTasks,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    )
):

    try:

        new_task = Task(

            title=task.title,

            description=task.description,

            priority=task.priority,

            workspace_id=task.workspace_id,

            assigned_to=task.assigned_to,

            status="todo"
        )

        db.add(new_task)

        db.commit()

        db.refresh(new_task)
                # SAVE ACTIVITY
        activity = Activity(

            workspace_id=
                task.workspace_id,

            user=
                current_user.name,

            action=
                f"created task '{new_task.title}'"
        )

        db.add(activity)

        db.commit()


        # REALTIME EVENT
        background_tasks.add_task(

            manager.broadcast,

            task.workspace_id,

            {
                    "event":
                    "task_created",

                    "task": {

                        "id":
                            new_task.id,

                        "title":
                            new_task.title,

                        "description":
                            new_task.description,

                        "priority":
                            new_task.priority,

                        "status":
                            new_task.status,

                        "workspace_id":
                            new_task.workspace_id,

                        "assigned_to":
                            new_task.assigned_to,

                        "due_date":
                            new_task.due_date.isoformat()

                            if new_task.due_date
                            else None
                    }
                }
            )

        return new_task

    except Exception as e:

        print("CREATE TASK ERROR:", e)

        raise HTTPException(

            status_code=500,

            detail=str(e)
        )


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

    try:

        tasks = db.query(Task).filter(

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

                "workspace_id": task.workspace_id,

                "assigned_to": task.assigned_to,

                "assigned_user": assigned_user,

                "due_date": task.due_date
            })

        return result

    except Exception as e:

        print("GET TASKS ERROR:", e)

        raise HTTPException(

            status_code=500,

            detail=str(e)
        )


# =========================
# UPDATE TASK STATUS
# =========================

@router.put("/{task_id}/status")
def update_task_status(

    task_id: int,

    data: dict,

    background_tasks: BackgroundTasks,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    )
):

    try:

        task = db.query(Task).filter(

            Task.id == task_id

        ).first()


        if not task:

            raise HTTPException(

                status_code=404,

                detail="Task not found"
            )


        task.status = data["status"]
        db.commit()

        db.refresh(task)
                # SAVE ACTIVITY
        activity = Activity(

            workspace_id=
                task.workspace_id,

            user=
                current_user.name,

            action=
                f"moved '{task.title}' to {task.status}"
        )

        db.add(activity)

        db.commit()
                # REALTIME ACTIVITY EVENT
        background_tasks.add_task(

            manager.broadcast,

            task.workspace_id,

            {
                    "event":
                    "activity",

                    "activity": {

                        "id":
                            activity.id,

                        "user":
                            activity.user,

                        "action":
                            activity.action
                    }
                }
            )


        # REALTIME EVENT
        background_tasks.add_task(

            manager.broadcast,

            task.workspace_id,

            {
                    "event":
                    "task_updated",

                    "task": {

                        "id":
                            task.id,

                        "status":
                            task.status
                    }
                }
            )


        return task

    except Exception as e:

        print(
            "UPDATE TASK STATUS ERROR:",
            e
        )

        raise HTTPException(

            status_code=500,

            detail=str(e)
        )