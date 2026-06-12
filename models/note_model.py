from database import Base
from sqlalchemy import Column, Integer, String,ForeignKey
from sqlalchemy.orm import relationship

class Note(Base):
    __tablename__ = 'notes1'
    id = Column(Integer, primary_key=True,unique=True)
    title = Column(String)
    content = Column(String)
    path = Column(String)
    user_id = Column(Integer, ForeignKey('users1.id'))

    user = relationship('User', back_populates='notes')
