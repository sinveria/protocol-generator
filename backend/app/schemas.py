from datetime import date
from pydantic import BaseModel


class MemberIn(BaseModel):
    role: str
    full_name: str
    short_name: str | None = None
    degree: str | None = None
    workplace: str | None = None
    position: str | None = None
    sort_order: int = 0


class StudentIn(BaseModel):
    seq_no: int
    full_name: str
    full_name_dative: str | None = None
    citizenship: str = "РФ"
    study_form: str | None = None
    thesis_topic: str | None = None
    supervisor: str | None = None
    qualification: str | None = None
    grade: str | None = None
    with_honors: bool = False


class SessionIn(BaseModel):
    number: int
    specialty_id: int | None = None
    education_level: str = "СПО"
    study_form: str | None = None
    work_type: str | None = None
    region: str = "Москва"
    event_date: date | None = None
    order_admission: str | None = None
    order_date: date | None = None
    members: list[MemberIn] = []
    students: list[StudentIn] = []


class SessionOut(SessionIn):
    id: int

    class Config:
        from_attributes = True