from collections import Counter
from .base import BaseGenerator, BOLD, CENTER, BORDER


class ChairmanReportGenerator(BaseGenerator):
    doc_type = "chairman_report"
    title = "Отчёт председателя ГЭК"

    def build(self, ws):
        s = self.session
        spec = s.specialty.name if s.specialty else ""
        chair = self.member_by_role("chairman")

        ws.merge_cells("A1:E1")
        ws["A1"] = "ОТЧЁТ ПРЕДСЕДАТЕЛЯ ГЭК"
        ws["A1"].font = BOLD
        ws["A1"].alignment = CENTER

        ws["A3"] = "Специальность:"
        ws["B3"] = spec
        ws["A4"] = "ГЭК №:"
        ws["B4"] = s.number
        ws["A5"] = "Дата проведения:"
        ws["B5"] = self.fmt_date(s.event_date)
        ws["A6"] = "Председатель ГЭК:"
        if chair:
            ws["B6"] = chair[0].full_name

        total = len(self.students)
        grades = Counter((st.grade or "").strip().lower() for st in self.students)
        honors = sum(1 for st in self.students if st.with_honors)

        hdr = 8
        ws.cell(hdr, 1, "Показатель").font = BOLD
        ws.cell(hdr, 2, "Кол-во").font = BOLD
        ws.cell(hdr, 3, "%").font = BOLD
        for col in range(1, 4):
            ws.cell(hdr, col).border = BORDER
            ws.cell(hdr, col).alignment = CENTER

        rows_data = [
            ("Допущено к защите", total),
            ("Отлично", grades.get("отлично", 0)),
            ("Хорошо", grades.get("хорошо", 0)),
            ("Удовлетворительно", grades.get("удовлетворительно", 0)),
            ("Неудовлетворительно", grades.get("неудовлетворительно", 0)),
            ("Дипломов с отличием", honors),
        ]
        r = hdr + 1
        for label, val in rows_data:
            ws.cell(r, 1, label)
            ws.cell(r, 2, val).alignment = CENTER
            pct = round(val / total * 100, 1) if total else 0
            ws.cell(r, 3, pct).alignment = CENTER
            for col in range(1, 4):
                ws.cell(r, col).border = BORDER
            r += 1

        r += 1
        good = grades.get("отлично", 0) + grades.get("хорошо", 0)
        if total:
            ws.cell(r, 1, "Качественная успеваемость, %:")
            ws.cell(r, 2, round(good / total * 100, 1)); r += 1
        r += 2
        ws.cell(r, 1, "Председатель ГЭК")
        if chair:
            ws.cell(r, 4, chair[0].short_name or chair[0].full_name)

        ws.column_dimensions["A"].width = 26
        ws.column_dimensions["B"].width = 12
        ws.column_dimensions["C"].width = 10
        ws.column_dimensions["D"].width = 20