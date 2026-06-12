from database import Base
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = 'users1'
    id = Column(Integer, primary_key=True,unique=True)
    name = Column(String)
    email = Column(String)
    password = Column(String)
    notes = relationship('Note', back_populates='user')

class OTP(Base):
    __tablename__ = 'otp'
    id = Column(Integer, primary_key=True)
    otp = Column(Integer)
    email = Column(String)
    expires = Column(DateTime)