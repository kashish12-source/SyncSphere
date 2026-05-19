from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.db.database import (
    get_db
)

from app.models.task import (
    Task
)

from app.schemas.task import (
    TaskCreate,
    TaskStatusUpdate,
    TaskAssign
)

from app.auth.jwt_handler import (
    get_current_user
)

from app.websocket.manager import (
    manager
)

from app.utils.activity_logger import (
    log_activity
)


router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"]
)


# CREATE TASK
@router.post("/create")
async def create_task(

    task: TaskCreate,

    db: Session = Depends(get_db),

    current_user = Depends(
        get_current_user
    )
):

    new_task = Task(

        title=task.title,

        description=task.description,

        priority=task.priority,

        status="todo",

        workspace_id=task.workspace_id,

        assigned_to=task.assigned_to
    )

    db.add(new_task)

    db.commit()

    db.refresh(new_task)


    # ACTIVITY LOG
    await log_activity(

        db,

        new_task.workspace_id,

        current_user.id,

        f"{current_user.name} created task '{new_task.title}'"
    )


    # WEBSOCKET EVENT
    await manager.broadcast(

        new_task.workspace_id,

        {
            "event":
                "task_created",

            "task":
                {
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
                        new_task.assigned_to
                }
        }
    )

    return new_task


# GET WORKSPACE TASKS
@router.get("/{workspace_id}")
def get_workspace_tasks(

    workspace_id: int,

    db: Session = Depends(get_db)
):

    tasks = db.query(
        Task
    ).filter(

        Task.workspace_id
        == workspace_id

    ).all()

    return tasks


# UPDATE TASK STATUS
@router.put("/{task_id}/status")
async def update_task_status(

    task_id: int,

    task_update: TaskStatusUpdate,

    db: Session = Depends(get_db),

    current_user = Depends(
        get_current_user
    )
):

    task = db.query(
        Task
    ).filter(

        Task.id == task_id

    ).first()


    if not task:

        raise HTTPException(

            status_code=404,

            detail="Task not found"
        )


    # UPDATE STATUS
    task.status = task_update.status

    db.commit()

    db.refresh(task)


    # ACTIVITY LOG
    await log_activity(

        db,

        task.workspace_id,

        current_user.id,

        f"{current_user.name} moved '{task.title}' to {task.status}"
    )


    # WEBSOCKET EVENT
    await manager.broadcast(

        task.workspace_id,

        {
            "event":
                "task_updated",

            "task":
                {
                    "id":
                        task.id,

                    "title":
                        task.title,

                    "description":
                        task.description,

                    "priority":
                        task.priority,

                    "status":
                        task.status,

                    "workspace_id":
                        task.workspace_id,

                    "assigned_to":
                        task.assigned_to
                }
        }
    )

    return task


# ASSIGN TASK
@router.put("/{task_id}/assign")
async def assign_task(

    task_id: int,

    task_assign: TaskAssign,

    db: Session = Depends(get_db),

    current_user = Depends(
        get_current_user
    )
):

    task = db.query(
        Task
    ).filter(

        Task.id == task_id

    ).first()


    if not task:

        raise HTTPException(

            status_code=404,

            detail="Task not found"
        )


    # ASSIGN USER
    task.assigned_to = (
        task_assign.assigned_to
    )

    db.commit()

    db.refresh(task)


    # ACTIVITY LOG
    await log_activity(

        db,

        task.workspace_id,

        current_user.id,

        f"{current_user.name} assigned task '{task.title}'"
    )


    # WEBSOCKET EVENT
    await manager.broadcast(

        task.workspace_id,

        {
            "event":
                "task_assigned",

            "task":
                {
                    "id":
                        task.id,

                    "assigned_to":
                        task.assigned_to
                }
        }
    )

    return task