from .base import BaseGenerator, BOLD, CENTER, LEFT


class ListCitizenshipGenerator(BaseGenerator):
    doc_type = "list_citizenship"
    title = "Список студентов в приказ (гражданство)"

    def build(self, ws):
        s = self.session
        spec = s.specialty.name if s.specialty else ""

        ws["A1"] = "ГЭК - РЕЗУЛЬТАТЫ РАБОТЫ ГАК (ИТОГИ)"
        ws["G1"] = "ИГА_062_АУП"
        ws["F2"] = "Исполнитель:   Секретарь ГЭК"
        ws["F3"] = "Адресат:   ДИ / ОДСЭиСФ"

        ws.merge_cells("A4:H4")
        ws["A4"] = " СПИСОК   СТУДЕНТОВ*"
        ws["A4"].font = BOLD
        ws["A4"].alignment = CENTER

        ws["A5"] = "по результатам мероприятий итоговой государственной аттестации "
        ws["A6"] = 'в приказ "Об окончании и присвоении квалификации" '

        ws["C7"] = " в  ГЭК №"
        ws["D7"] = s.number
        ws["E7"] = "от"
        ws["F7"] = self.fmt_date(s.event_date)
        ws["H7"] = f"{s.event_date.year if s.event_date else ''} г."

        ws["A8"] = "Тип   "
        ws["C8"] = s.work_type or "Дипломный проект"
        ws["A9"] = "Образовательная программа"
        ws["D9"] = s.education_level
        ws["F9"] = "Форма обучения  "
        ws["H9"] = s.study_form

        ws["A13"] = "Специальность / направление"
        ws["C13"] = spec

        hdr = 15
        ws.cell(hdr, 1, "№ п/п").font = BOLD
        ws.cell(hdr, 2, "Ф.И.О. СТУДЕНТА\n(полностью, в дательном падеже)").font = BOLD
        ws.merge_cells(start_row=hdr, start_column=2, end_row=hdr, end_column=5)
        ws.cell(hdr, 6, "Гражданство").font = BOLD
        ws.cell(hdr, 7, "Дата (защита ДР)").font = BOLD
        ws.cell(hdr, 8, 'Выдать диплом\n"с отличием"').font = BOLD
        for col in range(1, 9):
            ws.cell(hdr, col).alignment = CENTER

        ws.cell(hdr + 1, 7, self.fmt_date(s.event_date))
        ws.cell(hdr + 2, 7, "Результат (защита ДП)")

        r = hdr + 3
        for st in self.students:
            ws.cell(r, 1, st.seq_no).alignment = CENTER
            ws.cell(r, 2, st.full_name_dative or st.full_name).alignment = LEFT
            ws.merge_cells(start_row=r, start_column=2, end_row=r, end_column=5)
            ws.cell(r, 6, st.citizenship or "РФ").alignment = CENTER
            if st.with_honors:
                ws.cell(r, 8, "с отличием").alignment = CENTER
            r += 1

        ws.cell(r, 1, " ПРЕДСЕДАТЕЛЬ  ГЭК №")
        ws.cell(r, 4, s.number)
        chair = self.member_by_role("chairman")
        if chair:
            ws.cell(r, 6, chair[0].short_name or chair[0].full_name)
        r += 1
        ws.cell(r, 6, "подпись ")
        r += 1
        ws.cell(r, 1, " Секретарь ГЭК №")
        ws.cell(r, 4, s.number)
        secretary = self.member_by_role("secretary")
        if secretary:
            ws.cell(r, 6, secretary[0].short_name or secretary[0].full_name)
        r += 1
        ws.cell(r, 6, "подпись ")
        r += 1
        ws.cell(r, 7, "Дата")
        ws.cell(r, 8, self.fmt_date(s.event_date))

        ws.column_dimensions["A"].width = 6
        ws.column_dimensions["B"].width = 30
        ws.column_dimensions["F"].width = 14
        ws.column_dimensions["G"].width = 16
        ws.column_dimensions["H"].width = 16