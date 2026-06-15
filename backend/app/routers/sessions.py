from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/api/sessions", tags=["sessions"])


@router.post("", response_model=schemas.SessionOut)
def create_session(data: schemas.SessionIn, db: Session = Depends(get_db)):
    session = models.GekSession(**data.model_dump(exclude={"members", "students"}))
    session.members = [models.CommissionMember(**m.model_dump()) for m in data.members]
    session.students = [models.Student(**s.model_dump()) for s in data.students]
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@router.get("/{sid}", response_model=schemas.SessionOut)
def get_session(sid: int, db: Session = Depends(get_db)):
    s = db.get(models.GekSession, sid)
    if not s:
        raise HTTPException(404, "Сессия не найдена")
    return s


@router.get("", response_model=list[schemas.SessionOut])
def list_sessions(db: Session = Depends(get_db)):
    return db.query(models.GekSession).order_by(models.GekSession.id.desc()).all()


@router.delete("/{sid}")
def delete_session(sid: int, db: Session = Depends(get_db)):
    s = db.get(models.GekSession, sid)
    if not s:
        raise HTTPException(404)
    db.delete(s)
    db.commit()
    return {"ok": True}