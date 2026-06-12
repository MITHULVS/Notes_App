from pydantic import BaseModel
from datetime import datetime

class CreateUser(BaseModel):
    name: str
    email: str
    password: str

class Login(BaseModel):
    email: str
    password: str

class Password(BaseModel):
    password: str

class createotp(BaseModel):
    email: str

class otpResponse(BaseModel):
    email: str
    otp: int
    expires: datetime

class Response(BaseModel):
    message: str

class Token(BaseModel):
    token: str
    token_type: str

class otpToken(BaseModel):
    otp: int
    email: str




