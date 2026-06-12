from pydantic import BaseModel



class CreateNote(BaseModel):
    title: str


class NoteResponse(BaseModel):
    id: int
    title: str
    content: str
    path: str
    user_id: int
    model_config = {
        "from_attributes": True
    }



class UpdateNote(BaseModel):
    id: int
    title: str | None


