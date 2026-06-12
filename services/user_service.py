

from fastapi import HTTPException

from datetime import  datetime, timedelta
import random

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from schemas.user_validation import (
    CreateUser,
    Login,
    createotp,
    Password,
    otpToken
)

from utils.helpers import (
    hash_password,
    verify_password,
    create_access_token,
    verify_token
)

from models.note_model import Note
from models.user_model import User,OTP

async def login_services(
    user: Login,
    db: AsyncSession
):
    print(user.email,user.password)
    check = await db.execute(select(User).where(User.email == user.email))
    result = check.scalar_one_or_none()
    if not result:
        raise HTTPException(status_code=404,detail="User not found")

    verify=verify_password(user.password, result.password)
    if not verify:
        raise HTTPException(status_code=404,detail="Incorrect password or email")

    access_token = create_access_token({"id":result.id})

    return {
        "token": access_token,
        "token_type": "bearer"
    }



async def signup_services(
    user: CreateUser,
    db: AsyncSession
):
    check=await db.execute(select(User).where(User.email == user.email))
    result=check.scalar_one_or_none()
    if result:
        raise HTTPException(status_code=404, detail="Already registered")

    detail= User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password)
    )

    db.add(detail)
    await db.commit()
    await db.refresh(detail)
    return {
        "email": user.email,
        "password":user.password
    }


async def generate_otp_services(
    user: createotp,
    db: AsyncSession
):
    check=await db.execute(select(OTP).where(OTP.email == user.email))
    result = check.scalar_one_or_none()
    if result is not None:
        await db.delete(result)
        await db.commit()

    otp = random.randint(100000, 999999)
    expires_at = datetime.utcnow() + timedelta(minutes=5)
    store = OTP(email=user.email, otp=otp, expires=expires_at)
    db.add(store)
    await db.commit()
    await db.refresh(store)
    return store


async def reset_password_services(

    password: Login,
    db: AsyncSession
):
    detail=await db.execute(select(User).where(User.email == password.email))
    result = detail.scalar_one_or_none()
    if not result:
        raise HTTPException(status_code=404, detail="Register Again")

    result.password=hash_password(password.password)
    await db.commit()
    await db.refresh(result)
    return {
        "message": "Password Reset Successful",
    }

async def verify_otp_services(
    otp_detail:otpToken,
    db: AsyncSession
):
    store=await db.execute(select(OTP).where(OTP.email==otp_detail.email))
    result = store.scalar_one_or_none()
    if not result:
        raise HTTPException(status_code=404, detail="OTP not found")

    if result.otp != otp_detail.otp:
        raise HTTPException(status_code=404, detail="Incorrect OTP")

    if result.expires < datetime.utcnow():
        raise HTTPException(status_code=404, detail="OTP expired")

    return {
        "message": "OTP verified",
    }

