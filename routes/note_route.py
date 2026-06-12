from fastapi import APIRouter,Depends,UploadFile,File,Form
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db

from utils.helpers import verify_token
from typing import List

from services.note_service import (
    get_notes_services,
    get_note_services,
    add_note_services,
    delete_note_services,
)

from schemas.note_validation import (
    CreateNote,
    NoteResponse,
    UpdateNote
)

from schemas.user_validation import (
    Response
)

router = APIRouter()

@router.get("/get_notes",response_model=List[NoteResponse])
async def get_notes(db: AsyncSession = Depends(get_db),current_user= Depends(verify_token)):
    return await get_notes_services(db,current_user)

@router.get("/get_note/{note_id}",response_model=NoteResponse)
async def get_note(note_id:int ,db: AsyncSession = Depends(get_db),current_user= Depends(verify_token)):
    return await get_note_services(note_id,db,current_user)

@router.post("/add_note",response_model=NoteResponse)
async def add_note(title:str=Form(...),file:UploadFile=File(...),db: AsyncSession = Depends(get_db),current_user= Depends(verify_token)):
    return await add_note_services(file,title,db,current_user)

@router.delete("/delete_note/{note_id}",response_model=Response)
async def delete_note(note_id:int ,db: AsyncSession = Depends(get_db)):
    return await delete_note_services(note_id,db)


