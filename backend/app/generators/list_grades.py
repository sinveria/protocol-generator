from .base import BaseGenerator, BOLD, CENTER, LEFT, BORDER


class ListGradesGenerator(BaseGenerator):
    doc_type = "list_grades"
    title = "Список студентов (оценки)"

    def build(self, ws):
        s = self.session
        spec = s.specialty.name if s.specialty else ""

        ws.merge_cells("A1:J1")
        ws["A1"] = "ЗАЩИТА ДИПЛОМНОЙ РАБОТЫ"
        ws["A1"].font = BOLD
        ws["A1"].alignment = CENTER

        ws.merge_cells("A3:J3")
        ws["A3"] = " СПИСОК   СТУДЕНТОВ"
        ws["A3"].alignment = CENTER

        ws["D5"] = " в  ГЭК № "
        ws["E5"] = s.number
        ws["F5"] = "дата проведения"
        ws["H5"] = self.fmt_date(s.event_date)

        ws["A6"] = "Специальность"
        ws["C6"] = spec

        hdr = 8
        headers = ["№ п/п", "Ф.И.О. СТУДЕНТА\n(полностью)", None, None,
                   "Тема дипломной работы", None, None, None,
                   "ОЦЕНКА", "ИТОГОВАЯ ОЦЕНКА"]
        for col, h in enumerate(headers, 1):
            if h is not None:
                c = ws.cell(hdr, col, h)
                c.font = BOLD
                c.alignment = CENTER
        ws.merge_cells(start_row=hdr, start_column=2, end_row=hdr, end_column=4)
        ws.merge_cells(start_row=hdr, start_column=5, end_row=hdr, end_column=8)

        r = hdr + 2
        for st in self.students:
            ws.cell(r, 1, st.seq_no).alignment = CENTER
            ws.cell(r, 2, st.full_name).alignment = LEFT
            ws.merge_cells(start_row=r, start_column=2, end_row=r, end_column=4)
            ws.cell(r, 5, st.thesis_topic or "").alignment = LEFT
            ws.merge_cells(start_row=r, start_column=5, end_row=r, end_column=8)
            ws.cell(r, 9, st.grade or "").alignment = CENTER
            ws.cell(r, 10, st.grade or "").alignment = CENTER
            for col in range(1, 11):
                ws.cell(r, col).border = BORDER
            r += 1

        r += 1
        ws.cell(r, 5, "Подпись члена комиссии")

        ws.column_dimensions["A"].width = 6
        ws.column_dimensions["B"].width = 22
        ws.column_dimensions["E"].width = 40
        ws.column_dimensions["I"].width = 12
        ws.column_dimensions["J"].width = 14