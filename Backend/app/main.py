from fastapi import FastAPI
from app.db.database import engine
from app.models import user
from app.models.workspace import Workspace
from app.models.task import Task
from app.models.workspace_member import WorkspaceMember
from app.api.websocket import router as websocket_router
from app.models.notification import Notification

from app.api.task import router as task_router
from app.api.auth import router as auth_route
from app.api.workspace import router as workspace_router
from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware
from app.api.notification import (
    router as notification_router
)

app=FastAPI(
    title="SyncSphere API",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)

user.Base.metadata.create_all(bind=engine)
app.include_router(workspace_router)
app.include_router(websocket_router)
app.include_router(notification_router)

app.include_router(auth_route)
app.include_router(task_router)

@app.get("/")
def read():
    return {"message":"hello kashihs"}