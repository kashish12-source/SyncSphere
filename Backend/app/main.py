from fastapi import FastAPI
from app.db.database import engine
from app.models import user
from app.models.workspace import Workspace
from app.models.workspace_member import WorkspaceMember

from app.api.auth import router as auth_route
from app.api.workspace import router as workspace_router

app=FastAPI(
    title="SyncSpace API",
    version="1.0.0"
)

user.Base.metadata.create_all(bind=engine)
app.include_router(workspace_router)

app.include_router(auth_route)

@app.get("/")
def read():
    return {"message":"hello kashihs"}