from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.db.database import (
    get_db
)

from app.models.workspace import (
    Workspace
)

from app.models.workspace_member import (
    WorkspaceMember
)

from app.models.user import (
    User
)

from app.schemas.workspace import (
    WorkspaceCreate
)

from app.schemas.member import (
    AddMemberSchema
)

from app.auth.jwt_handler import (
    get_current_user
)


router = APIRouter(

    prefix="/workspace",

    tags=["Workspace"]
)


# CREATE WORKSPACE
@router.post("/create")
def create_workspace(

    workspace: WorkspaceCreate,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    )
):

    new_workspace = Workspace(

        name=workspace.name,

        description=
        workspace.description,

        owner_id=current_user.id
    )

    db.add(new_workspace)

    db.commit()

    db.refresh(new_workspace)


    # ADD OWNER AS ADMIN
    owner_member = WorkspaceMember(

        workspace_id=
        new_workspace.id,

        user_id=current_user.id,

        role="admin"
    )

    db.add(owner_member)

    db.commit()


    return {

        "id":
        new_workspace.id,

        "name":
        new_workspace.name,

        "description":
        new_workspace.description,

        "owner_id":
        new_workspace.owner_id
    }


# GET MY WORKSPACES
@router.get("/my-workspaces")
def get_my_workspaces(

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    )
):

    memberships = db.query(
        WorkspaceMember
    ).filter(

        WorkspaceMember.user_id
        == current_user.id

    ).all()


    result = []


    for member in memberships:

        workspace = db.query(
            Workspace
        ).filter(

            Workspace.id ==
            member.workspace_id

        ).first()


        if workspace:

            result.append({

                "id":
                workspace.id,

                "name":
                workspace.name,

                "description":
                workspace.description,

                "role":
                member.role
            })


    return result


# GET WORKSPACE MEMBERS
@router.get("/{workspace_id}/members")
def get_workspace_members(

    workspace_id: int,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    )
):

    # CHECK USER IS MEMBER
    member_check = db.query(
        WorkspaceMember
    ).filter(

        WorkspaceMember.workspace_id
        == workspace_id,

        WorkspaceMember.user_id
        == current_user.id

    ).first()


    if not member_check:

        raise HTTPException(

            status_code=403,

            detail=
            "Not a workspace member"
        )


    members = db.query(
        WorkspaceMember
    ).filter(

        WorkspaceMember.workspace_id
        == workspace_id

    ).all()


    users = []


    for member in members:

        user = db.query(
            User
        ).filter(

            User.id ==
            member.user_id

        ).first()


        if user:

            users.append({

                "id":
                user.id,

                "name":
                user.name,

                "email":
                user.email,

                "role":
                member.role
            })


    return users


# ADD MEMBER
@router.post("/{workspace_id}/add-member")
def add_workspace_member(

    workspace_id: int,

    member_data: AddMemberSchema,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    )
):

    # CHECK ADMIN
    admin_member = db.query(
        WorkspaceMember
    ).filter(

        WorkspaceMember.workspace_id
        == workspace_id,

        WorkspaceMember.user_id
        == current_user.id,

        WorkspaceMember.role
        == "admin"

    ).first()


    if not admin_member:

        raise HTTPException(

            status_code=403,

            detail=
            "Only admins can add members"
        )


    # FIND USER
    user = db.query(
        User
    ).filter(

        User.email ==
        member_data.email

    ).first()


    if not user:

        raise HTTPException(

            status_code=404,

            detail="User not found"
        )


    # CHECK ALREADY MEMBER
    existing_member = db.query(
        WorkspaceMember
    ).filter(

        WorkspaceMember.workspace_id
        == workspace_id,

        WorkspaceMember.user_id
        == user.id

    ).first()


    if existing_member:

        raise HTTPException(

            status_code=400,

            detail=
            "User already member"
        )


    # CREATE MEMBER
    new_member = WorkspaceMember(

        workspace_id=
        workspace_id,

        user_id=user.id,

        role=member_data.role
    )

    db.add(new_member)

    db.commit()


    return {

        "message":
        "Member added successfully"
    }