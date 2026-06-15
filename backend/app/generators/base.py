from abc import ABC, abstractmethod
from io import BytesIO
import openpyxl
from openpyxl.styles import Font, Alignment, Border, Side

THIN = Side(style="thin")
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)
CENTER = Alignment(horizontal="center", vertical="center", wrap_text=True)
LEFT = Alignment(horizontal="left", vertical="center", wrap_text=True)
BOLD = Font(bold=True)


class BaseGenerator(ABC):
    doc_type: str = ""
    title: str = ""

    def __init__(self, session, students, members):
        self.session = session
        self.students = students
        self.members = members

    @abstractmethod
    def build(self, ws):
        """Заполняет worksheet."""

    def generate(self) -> bytes:
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Document"
        self.build(ws)
        buf = BytesIO()
        wb.save(buf)
        buf.seek(0)
        return buf.read()

    def member_by_role(self, role):
        return [m for m in self.members if m.role == role]

    def fmt_date(self, d):
        return d.strftime("%d.%m.%Y г.") if d else ""