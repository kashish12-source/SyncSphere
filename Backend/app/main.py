from fastapi import FastAPI

from fastapi.middleware.cors import (
    CORSMiddleware
)

from app.models.chat_message import ChatMessage

from fastapi.staticfiles import (
    StaticFiles
)

from app.db.database import (
    engine,
    Base
)

from app.api.chat import (
    router as chat_router
)

# IMPORT ALL MODELS
from app.models.user import User
from app.models.workspace import Workspace
from app.models.task import Task
from app.models.workspace_member import WorkspaceMember
from app.models.notification import Notification
from app.models.comment import Comment
from app.models.activity import Activity
from app.models.attachment import Attachment

# IMPORT ROUTERS
from app.api.auth import (
    router as auth_route
)


from app.api.workspace import (
    router as workspace_router
)

from app.api.task import (
    router as task_router
)

from app.api.websocket import (
    router as websocket_router
)

from app.api.notification import (
    router as notification_router
)

from app.api.comment import (
    router as comment_router
)

from app.api.activity import (
    router as activity_router
)

from app.api.attachment import (
    router as attachment_router
)


# CREATE DATABASE TABLES
Base.metadata.create_all(
    bind=engine
)


# FASTAPI APP
app = FastAPI(

    title="SyncSphere API",

    version="1.0.0"
)


# STATIC FILES
app.mount(

    "/uploads",

    StaticFiles(
        directory="uploads"
    ),

    name="uploads"
)


# CORS
app.add_middleware(

    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# REGISTER ROUTERS
app.include_router(
    auth_route
)

app.include_router(
    workspace_router
)

app.include_router(
    task_router
)

app.include_router(chat_router)

app.include_router(
    websocket_router
)

app.include_router(
    notification_router
)

app.include_router(
    comment_router
)

app.include_router(
    activity_router
)

app.include_router(
    attachment_router
)


# ROOT ROUTE
@app.get("/")
def read_root():

    return {

        "message":
            "Welcome to SyncSphere API"
    }