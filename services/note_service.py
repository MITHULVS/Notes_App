from fastapi import HTTPException,UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from schemas.note_validation import (
    CreateNote,
    UpdateNote,
)

from models.note_model import Note

async def get_notes_services(
    db: AsyncSession,
    current_user
):
    note = await db.execute(select(Note).where( current_user["id"]== Note.user_id))
    result = note.scalars().all()

    return result


async def get_note_services(
    note_id: int,
    db: AsyncSession,
    current_user
):
    note= await db.execute(select(Note).where(note_id==Note.id,current_user["id"]== Note.user_id))
    result = note.scalars().one_or_none()
    if result is None:
        raise HTTPException(status_code=404, detail="Note not found")

    return result


async def add_note_services(
    file: UploadFile,
    title: str,
    db: AsyncSession,
    current_user
):
    if file.content_type != "text/plain":
        raise HTTPException(
            status_code=400,
            detail="Content type not supported"
        )

    content = await file.read()
    text_content = content.decode("utf-8")

    path = f"uploads/{file.filename}"

    with open(path, "wb") as f:
        f.write(content)

    detail = Note(
        title=title,
        content=text_content,
        path=path,
        user_id=current_user["id"]
    )

    db.add(detail)
    await db.commit()
    await db.refresh(detail)

    return detail


async def delete_note_services(
    note_id: int,
    db: AsyncSession,
):
    note = await db.execute(select(Note).where(note_id == Note.id))
    result = note.scalars().one_or_none()
    if result is None:
        raise HTTPException(status_code=404, detail="Note not found")

    await db.delete(result)
    await db.commit()

    return {
        "message": "Note deleted"
    }
