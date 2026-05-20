from fastapi import FastAPI

from fastapi.middleware.cors import (
    CORSMiddleware
)

from app.db.database import (
    Base,
    engine
)

# MODELS
from app.models.user import User
from app.models.workspace import Workspace
from app.models.task import Task

# ROUTERS
from app.api.auth import (
    router as auth_router
)

from app.api.workspace import (
    router as workspace_router
)

from app.api.task import (
    router as task_router
)

from app.api.chat import (
    router as chat_router
)

from app.api.attachment import (
    router as attachment_router
)

from app.api.comment import (
    router as comment_router
)

from app.api.activity import (
    router as activity_router
)

# OPTIONAL ROUTERS
try:

    from app.api.notification import (
        router as notification_router
    )

except:

    notification_router = None


# WEBSOCKET
try:

    from app.websocket.websocket import (
        router as websocket_router
    )

except:

    websocket_router = None


app = FastAPI()


# =========================
# CORS
# =========================

app.add_middleware(

    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]
)


# =========================
# CREATE TABLES
# =========================

Base.metadata.create_all(
    bind=engine
)


# =========================
# ROUTERS
# =========================

app.include_router(
    auth_router
)

app.include_router(
    workspace_router
)

app.include_router(
    task_router
)

app.include_router(
    chat_router
)

app.include_router(
    attachment_router
)

app.include_router(
    comment_router
)

app.include_router(
    activity_router
)


if notification_router:

    app.include_router(
        notification_router
    )


if websocket_router:

    app.include_router(
        websocket_router
    )


# =========================
# ROOT
# =========================

@app.get("/")
def root():

    return {

        "message":
        "SyncSphere Backend Running"
    }