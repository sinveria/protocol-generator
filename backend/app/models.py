from sqlalchemy import (Column, Integer, String, Text, Boolean, Date,
                        ForeignKey, DateTime, func)
from sqlalchemy.orm import relationship
from .database import Base


class Specialty(Base):
    __tablename__ = "specialties"
    id = Column(Integer, primary_key=True)
    code = Column(String(32))
    name = Column(Text, nullable=False)


class GekSession(Base):
    __tablename__ = "gek_sessions"
    id = Column(Integer, primary_key=True)
    number = Column(Integer, nullable=False)
    specialty_id = Column(Integer, ForeignKey("specialties.id"))
    education_level = Column(String(16), default="СПО")
    study_form = Column(String(32))
    work_type = Column(String(64))
    region = Column(String(128), default="Москва")
    event_date = Column(Date)
    order_admission = Column(String(64))
    order_date = Column(Date)
    created_at = Column(DateTime, server_default=func.now())

    specialty = relationship("Specialty")
    members = relationship("CommissionMember", cascade="all, delete-orphan",
                           order_by="CommissionMember.sort_order")
    students = relationship("Student", cascade="all, delete-orphan",
                            order_by="Student.seq_no")


class CommissionMember(Base):
    __tablename__ = "commission_members"
    id = Column(Integer, primary_key=True)
    session_id = Column(Integer, ForeignKey("gek_sessions.id", ondelete="CASCADE"))
    role = Column(String(32), nullable=False)
    full_name = Column(Text, nullable=False)
    short_name = Column(String(64))
    degree = Column(String(128))
    workplace = Column(Text)
    position = Column(String(255))
    sort_order = Column(Integer, default=0)


class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True)
    session_id = Column(Integer, ForeignKey("gek_sessions.id", ondelete="CASCADE"))
    seq_no = Column(Integer)
    full_name = Column(Text, nullable=False)
    full_name_dative = Column(Text)
    citizenship = Column(String(64), default="РФ")
    study_form = Column(String(32))
    thesis_topic = Column(Text)
    supervisor = Column(String(128))
    qualification = Column(String(128))
    grade = Column(String(32))
    with_honors = Column(Boolean, default=False)
    defense_date = Column(Date)
    notes = Column(Text)

    questions = relationship("StudentQuestion", cascade="all, delete-orphan")


class StudentQuestion(Base):
    __tablename__ = "student_questions"
    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"))
    asked_by = Column(String(64))
    question = Column(Text)


class GeneratedDocument(Base):
    __tablename__ = "generated_documents"
    id = Column(Integer, primary_key=True)
    session_id = Column(Integer, ForeignKey("gek_sessions.id", ondelete="CASCADE"))
    doc_type = Column(String(64), nullable=False)
    filename = Column(String(255))
    created_at = Column(DateTime, server_default=func.now())