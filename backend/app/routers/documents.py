# app/routers/documents.py
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from io import BytesIO
from sqlalchemy.orm import Session
from .. import models
from ..database import get_db
from ..generators.registry import get_generator, GENERATORS

router = APIRouter(prefix="/api/documents", tags=["documents"])


@router.get("/types")
def doc_types():
    return [{"type": t, "title": cls.title} for t, cls in GENERATORS.items()]


@router.get("/{sid}/{doc_type}")
def generate_document(sid: int, doc_type: str, db: Session = Depends(get_db)):
    session = db.get(models.GekSession, sid)
    if not session:
        raise HTTPException(404, "Сессия не найдена")
    try:
        gen_cls = get_generator(doc_type)
    except ValueError as e:
        raise HTTPException(400, str(e))

    gen = gen_cls(session, session.students, session.members)
    data = gen.generate()

    fname = f"{doc_type}_gek{session.number}.xlsx"
    db.add(models.GeneratedDocument(session_id=sid, doc_type=doc_type, filename=fname))
    db.commit()

    headers = {"Content-Disposition": f'attachment; filename="{fname}"'}
    return StreamingResponse(
        BytesIO(data),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers=headers,
    )