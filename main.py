from fastapi import FastAPI,Request
from fastapi.middleware.cors import CORSMiddleware
from scalar_fastapi import get_scalar_api_reference
from contextlib import asynccontextmanager

from routes.note_route import router as note
from routes.user_route import router as user

from database import init_db

import time
from fastapi.middleware.cors import CORSMiddleware



@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Welcome to lifespan")
    await init_db()

    yield
    print("Bye from lifespan")

app = FastAPI(
    title="Note App",
    version="1.0",
    description="This Api provides access to note app",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    s=time.perf_counter()
    response = await call_next(request)
    e=time.perf_counter()
    print(e-s)
    return response

@app.get("/")
def root():
    return {"message": "API is running"}

@app.get("/scalar", include_in_schema=False)
def scalar():

    return get_scalar_api_reference(
        openapi_url=app.openapi_url,
        title="Scalar API",
    )

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

app.include_router(user, prefix="/user", tags=["User"])
app.include_router(note, prefix="/note", tags=["Note"])