from fastapi import FastAPI
from app.db.database import engine
from app.models import user

from app.api.auth import router as auth_route

app=FastAPI(
    title="SyncSpace API",
    version="1.0.0"
)

user.Base.metadata.create_all(bind=engine)

app.include_router(auth_route)

@app.get("/")
def read():
    return {"message":"hello kashihs"}