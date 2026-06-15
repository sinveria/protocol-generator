from fastapi import APIRouter, UploadFile, File, HTTPException
from ..parsers.student_parser import parse_student_file

router = APIRouter(prefix="/api/upload", tags=["upload"])


@router.post("/students")
async def upload_students(file: UploadFile = File(...)):
    if not file.filename.lower().endswith((".xls", ".xlsx")):
        raise HTTPException(400, "Поддерживаются только .xls / .xlsx")
    content = await file.read()
    try:
        return parse_student_file(content, file.filename)
    except Exception as e:
        raise HTTPException(400, f"Ошибка разбора файла: {e}")