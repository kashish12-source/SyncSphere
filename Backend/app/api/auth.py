from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from fastapi.security import (
    OAuth2PasswordRequestForm
)

from sqlalchemy.orm import Session

from app.db.database import (
    get_db
)

from app.models.user import (
    User
)

from app.schemas.user_schemas import (
    UserCreate
)

from app.auth.hashing import (
    hash_password,
    verify_password
)

from app.auth.jwt_handler import (
    create_access_token,
    get_current_user
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# REGISTER
@router.post("/register")
def register_user(

    user: UserCreate,

    db: Session = Depends(get_db)
):

    existing_user = db.query(
        User
    ).filter(

        User.email == user.email

    ).first()


    if existing_user:

        raise HTTPException(

            status_code=400,

            detail=
            "Email already registered"
        )


    hashed_password = hash_password(
        user.password
    )


    new_user = User(

        name=user.name,

        email=user.email,

        password=hashed_password
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)


    return {
        "message":
        "User registered successfully"
    }


# LOGIN
@router.post("/login")
def login_user(

    form_data:
    OAuth2PasswordRequestForm
    = Depends(),

    db: Session = Depends(get_db)
):

    existing_user = db.query(
        User
    ).filter(

        User.email ==
        form_data.username

    ).first()


    if not existing_user:

        raise HTTPException(

            status_code=404,

            detail="Invalid email"
        )


    valid_password = verify_password(

        form_data.password,

        existing_user.password
    )


    if not valid_password:

        raise HTTPException(

            status_code=401,

            detail="Invalid password"
        )


    access_token = create_access_token(

        data={
            "sub":
            existing_user.email
        }
    )


    return {

        "access_token":
        access_token,

        "token_type":
        "bearer"
    }


# CURRENT USER
@router.get("/me")
def get_logged_in_user(

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