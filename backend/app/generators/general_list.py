from collections import Counter
from .base import BaseGenerator, BOLD, CENTER, LEFT, BORDER

GRADE_ORDER = ["отлично", "хорошо", "удовлетворительно", "неудовлетворительно"]


class GeneralListGenerator(BaseGenerator):
    doc_type = "general_list"
    title = "Общий список + статистика"

    def build(self, ws):
        s = self.session
        spec = s.specialty.name if s.specialty else ""

        ws.merge_cells("A1:F1")
        ws["A1"] = f"ОБЩИЙ СПИСОК СТУДЕНТОВ ГЭК № {s.number}"
        ws["A1"].font = BOLD
        ws["A1"].alignment = CENTER
        ws["A2"] = "Специальность:"
        ws["B2"] = spec
        ws["A3"] = "Дата защиты:"
        ws["B3"] = self.fmt_date(s.event_date)

        hdr = 5
        for col, h in enumerate(["№ п/п", "Ф.И.О.", "Тема", "Оценка", "С отличием"], 1):
            c = ws.cell(hdr, col, h)
            c.font = BOLD
            c.alignment = CENTER
            c.border = BORDER

        r = hdr + 1
        for st in self.students:
            ws.cell(r, 1, st.seq_no).alignment = CENTER
            ws.cell(r, 2, st.full_name).alignment = LEFT
            ws.cell(r, 3, st.thesis_topic or "").alignment = LEFT
            ws.cell(r, 4, st.grade or "").alignment = CENTER
            ws.cell(r, 5, "да" if st.with_honors else "").alignment = CENTER
            for col in range(1, 6):
                ws.cell(r, col).border = BORDER
            r += 1

        r += 1
        ws.cell(r, 1, "СТАТИСТИКА").font = BOLD
        r += 1
        total = len(self.students)
        grades = Counter((st.grade or "").strip().lower() for st in self.students)
        honors = sum(1 for st in self.students if st.with_honors)

        ws.cell(r, 1, "Всего студентов:")
        ws.cell(r, 2, total); r += 1
        for g in GRADE_ORDER:
            ws.cell(r, 1, f"Оценка «{g}»:")
            ws.cell(r, 2, grades.get(g, 0)); r += 1
        ws.cell(r, 1, "Дипломов с отличием:")
        ws.cell(r, 2, honors); r += 1

        good = grades.get("отлично", 0) + grades.get("хорошо", 0)
        passed = total - grades.get("неудовлетворительно", 0)
        if total:
            ws.cell(r, 1, "Качественная успеваемость, %:")
            ws.cell(r, 2, round(good / total * 100, 1)); r += 1
            ws.cell(r, 1, "Абсолютная успеваемость, %:")
            ws.cell(r, 2, round(passed / total * 100, 1)); r += 1
            grade_vals = {"отлично": 5, "хорошо": 4,
                          "удовлетворительно": 3, "неудовлетворительно": 2}
            avg = sum(grade_vals.get(g, 0) * c for g, c in grades.items()) / total
            ws.cell(r, 1, "Средний балл:")
            ws.cell(r, 2, round(avg, 2))

        ws.column_dimensions["A"].width = 22
        ws.column_dimensions["B"].width = 28
        ws.column_dimensions["C"].width = 45
        ws.column_dimensions["D"].width = 16
        ws.column_dimensions["E"].width = 12