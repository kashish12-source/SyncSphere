from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session

from app.db.session import get_db

from app.models.workspace import Workspace
from app.models.workspace_member import WorkspaceMember

from app.schemas.workspace_schema import (
    WorkspaceCreate
)

from app.auth.oauth2 import get_current_user

from app.models.user import User

from app.schemas.workspace_schema import (
    WorkspaceCreate,
    InviteMember
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
    current_user: User = Depends(get_current_user)
):

    new_workspace = Workspace(
        name=workspace.name,
        owner_id=current_user.id
    )

    db.add(new_workspace)
    db.commit()
    db.refresh(new_workspace)

    # ADD OWNER AS MEMBER
    owner_member = WorkspaceMember(
        workspace_id=new_workspace.id,
        user_id=current_user.id,
        role="admin"
    )

    db.add(owner_member)
    db.commit()

    return {
        "message": "Workspace created successfully",
        "workspace_id": new_workspace.id
    }


# GET ALL USER WORKSPACES
@router.get("/my-workspaces")
def get_my_workspaces(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    memberships = db.query(
        WorkspaceMember
    ).filter(
        WorkspaceMember.user_id == current_user.id
    ).all()

    workspace_list = []

    for membership in memberships:

        workspace = db.query(Workspace).filter(
            Workspace.id == membership.workspace_id
        ).first()

        workspace_list.append({
            "workspace_id": workspace.id,
            "workspace_name": workspace.name,
            "role": membership.role
        })

    return workspace_list

    # INVITE MEMBER
@router.post("/invite")
def invite_member(
    invite: InviteMember,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # CHECK WORKSPACE EXISTS
    workspace = db.query(Workspace).filter(
        Workspace.id == invite.workspace_id
    ).first()

    if not workspace:
        raise HTTPException(
            status_code=404,
            detail="Workspace not found"
        )

    # CHECK CURRENT USER IS ADMIN
    current_membership = db.query(
        WorkspaceMember
    ).filter(
        WorkspaceMember.workspace_id == invite.workspace_id,
        WorkspaceMember.user_id == current_user.id
    ).first()

    if not current_membership:
        raise HTTPException(
            status_code=403,
            detail="Not a workspace member"
        )

    if current_membership.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Only admins can invite users"
        )

    # FIND USER TO INVITE
    invited_user = db.query(User).filter(
        User.email == invite.user_email
    ).first()

    if not invited_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # CHECK ALREADY MEMBER
    existing_member = db.query(
        WorkspaceMember
    ).filter(
        WorkspaceMember.workspace_id == invite.workspace_id,
        WorkspaceMember.user_id == invited_user.id
    ).first()

    if existing_member:
        raise HTTPException(
            status_code=400,
            detail="User already in workspace"
        )

    # ADD MEMBER
    new_member = WorkspaceMember(
        workspace_id=invite.workspace_id,
        user_id=invited_user.id,
        role=invite.role
    )

    db.add(new_member)
    db.commit()

    return {
        "message": "User added to workspace"
    }

# GET WORKSPACE MEMBERS
@router.get("/{workspace_id}/members")
def get_workspace_members(
    workspace_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # CHECK USER BELONGS TO WORKSPACE
    membership = db.query(
        WorkspaceMember
    ).filter(
        WorkspaceMember.workspace_id == workspace_id,
        WorkspaceMember.user_id == current_user.id
    ).first()

    if not membership:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    members = db.query(
        WorkspaceMember
    ).filter(
        WorkspaceMember.workspace_id == workspace_id
    ).all()

    member_list = []

    for member in members:

        user = db.query(User).filter(
            User.id == member.user_id
        ).first()

        member_list.append({
            "user_id": user.id,
            "name": user.name,
            "email": user.email,
            "role": member.role
        })

    return member_list