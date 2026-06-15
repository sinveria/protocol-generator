from io import BytesIO
from datetime import datetime, timedelta
import openpyxl
import xlrd

def _excel_serial_to_date(value):
    """Excel-дата (число) -> date"""
    if isinstance(value, (int, float)):
        return (datetime(1899, 12, 30) + timedelta(days=int(value))).date()
    return None


def _read_rows(file_bytes: bytes, filename: str) -> list[list]:
    """Читает любой xls/xlsx в список строк."""
    if filename.lower().endswith(".xlsx"):
        wb = openpyxl.load_workbook(BytesIO(file_bytes), data_only=True)
        ws = wb.active
        return [list(row) for row in ws.iter_rows(values_only=True)]
    else:
        book = xlrd.open_workbook(file_contents=file_bytes)
        sheet = book.sheet_by_index(0)
        return [sheet.row_values(r) for r in range(sheet.nrows)]


def _find_header_row(rows: list[list]) -> int:
    """Ищет строку-заголовок таблицы (содержит '№ п/п')."""
    for i, row in enumerate(rows):
        for cell in row:
            if cell and str(cell).strip().startswith("№ п/п"):
                return i
    return -1


def _is_data_row(row: list) -> bool:
    """Строка данных: первая ячейка — порядковый номер (int)."""
    if not row:
        return False
    first = row[0]
    return isinstance(first, (int, float)) and float(first).is_integer()


def parse_student_file(file_bytes: bytes, filename: str) -> dict:
    """
    Возвращает {meta: {...}, students: [...]}.
    meta — то, что удалось извлечь (№ ГЭК, специальность, дата).
    """
    rows = _read_rows(file_bytes, filename)
    meta = _extract_meta(rows)
    header_idx = _find_header_row(rows)
    if header_idx < 0:
        raise ValueError("Не найдена таблица студентов (строка '№ п/п')")

    header = [str(c).strip() if c else "" for c in rows[header_idx]]
    col_map = _map_columns(header)

    students = []
    for row in rows[header_idx + 1:]:
        if not _is_data_row(row):
            if row and row[0] and isinstance(row[0], str):
                continue
            continue
        students.append(_extract_student(row, col_map))
    return {"meta": meta, "students": students}


def _extract_meta(rows: list[list]) -> dict:
    meta = {}
    for row in rows:
        for j, cell in enumerate(row):
            if not cell:
                continue
            text = str(cell)
            if "ГЭК" in text and "№" in text:
                for k in range(j, min(j + 4, len(row))):
                    if isinstance(row[k], (int, float)):
                        meta["gek_number"] = int(row[k])
                        break
            if text.strip().lower().startswith(("специальность", "образовательная программа")):
                vals = [c for c in row if c and str(c).strip()]
                if len(vals) >= 2:
                    meta["specialty"] = str(vals[-1]).strip()
    return meta


def _map_columns(header: list[str]) -> dict:
    """Сопоставление заголовков со стандартными полями."""
    mapping = {}
    for idx, name in enumerate(header):
        low = name.lower()
        if "ф.и.о" in low:
            mapping["full_name"] = idx
        elif "тема" in low:
            mapping["thesis_topic"] = idx
        elif "форма" in low and "обуч" in low:
            mapping["study_form"] = idx
        elif "гражданств" in low:
            mapping["citizenship"] = idx
        elif "результат" in low or "оценка" in low:
            mapping["grade"] = idx
        elif "отличием" in low or "с отличием" in low:
            mapping["with_honors"] = idx
        elif "приказ" in low:
            mapping["order"] = idx
    return mapping


def _extract_student(row: list, col_map: dict) -> dict:
    def get(field):
        idx = col_map.get(field)
        if idx is not None and idx < len(row) and row[idx]:
            return str(row[idx]).strip()
        return None

    honors_raw = get("with_honors")
    return {
        "seq_no": int(row[0]),
        "full_name": get("full_name"),
        "thesis_topic": get("thesis_topic"),
        "study_form": get("study_form"),
        "citizenship": get("citizenship") or "РФ",
        "grade": get("grade"),
        "with_honors": bool(honors_raw and "да" in honors_raw.lower()),
    }