from fastapi import APIRouter,Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db

from services.user_service import (
    login_services,
    signup_services,
    generate_otp_services,
    verify_otp_services,
    reset_password_services
)

from schemas.user_validation import (
    Response,
    CreateUser,
    createotp,
    otpResponse,
    Login,
    Token,
    Password,
    otpToken
)

router = APIRouter()

@router.post("/login",response_model=Token)
async def login(user:Login,db: AsyncSession = Depends(get_db)):
    return await login_services(user,db)

@router.post("/signup",response_model=Login)
async def signup(user: CreateUser,db: AsyncSession = Depends(get_db)):
    return await signup_services(user,db)

@router.post("/generate_otp",response_model=otpResponse)
async def generate_otp(user:createotp,db: AsyncSession = Depends(get_db)):
    return await generate_otp_services(user,db)

@router.post("/verify_otp",response_model=Response)
async def verify_otp(otp:otpToken,db: AsyncSession = Depends(get_db)):
    return await verify_otp_services(otp,db)

@router.patch("/reset_password",response_model=Response)
async def reset_password(password:Login,db: AsyncSession = Depends(get_db)):
    return await reset_password_services(password, db)