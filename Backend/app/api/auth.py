from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from fastapi.security import (
    OAuth2PasswordRequestForm
)

from sqlalchemy.orm import Session

from passlib.context import (
    CryptContext
)

from pydantic import BaseModel

from app.db.database import (
    get_db
)

from app.models.user import (
    User
)

from app.auth.jwt_handler import (
    create_access_token,
    get_current_user
)


router = APIRouter(

    prefix="/auth",

    tags=["Auth"]
)


pwd_context = CryptContext(

    schemes=["bcrypt"],

    deprecated="auto"
)


# =========================
# SCHEMA
# =========================

class RegisterSchema(BaseModel):

    name: str

    email: str

    password: str


# =========================
# REGISTER
# =========================

@router.post("/register")
def register(

    data: RegisterSchema,

    db: Session = Depends(get_db)
):

    try:

        existing_user = db.query(
            User
        ).filter(

            User.email == data.email

        ).first()


        if existing_user:

            raise HTTPException(

                status_code=400,

                detail="Email already exists"
            )


        hashed_password = pwd_context.hash(
            data.password
        )


        new_user = User(

            name=data.name,

            email=data.email,

            password=hashed_password
        )


        db.add(new_user)

        db.commit()

        db.refresh(new_user)


        return {

            "message":
            "User registered successfully"
        }

    except Exception as e:

        print("REGISTER ERROR:", e)

        raise HTTPException(

            status_code=500,

            detail=str(e)
        )


# =========================
# LOGIN
# =========================

@router.post("/login")
def login(

    form_data:
    OAuth2PasswordRequestForm = Depends(),

    db: Session = Depends(get_db)
):

    try:

        user = db.query(User).filter(

            User.email
            == form_data.username

        ).first()


        if not user:

            raise HTTPException(

                status_code=401,

                detail="Invalid credentials"
            )


        valid_password = pwd_context.verify(

            form_data.password,

            user.password
        )


        if not valid_password:

            raise HTTPException(

                status_code=401,

                detail="Invalid credentials"
            )


        token = create_access_token(

            data={
                "sub": user.email
            }
        )


        return {

            "access_token":
                token,

            "token_type":
                "bearer"
        }

    except Exception as e:

        print("LOGIN ERROR:", e)

        raise HTTPException(

            status_code=500,

            detail=str(e)
        )


# =========================
# CURRENT USER
# =========================

@router.get("/me")
def get_me(

    current_user: User = Depends(
        get_current_user
    )
):

    return {

        "id":
            current_user.id,

        "name":
            current_user.name,

        "email":
            current_user.email
    }