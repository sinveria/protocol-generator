import type { Student } from "../types";
import { GRADES } from "../types";

interface Props {
  students: Student[];
  onChange: (students: Student[]) => void;
}

export default function StudentsTable({ students, onChange }: Props) {
  function update(idx: number, patch: Partial<Student>) {
    onChange(students.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  }

  function add() {
    onChange([
      ...students,
      { seq_no: students.length + 1, full_name: "", citizenship: "РФ" },
    ]);
  }

  function remove(idx: number) {
    const next = students
      .filter((_, i) => i !== idx)
      .map((s, i) => ({ ...s, seq_no: i + 1 }));
    onChange(next);
  }

  return (
    <fieldset style={{ marginBottom: 20, border: "1px solid #ccc", borderRadius: 8 }}>
      <legend style={{ fontWeight: "bold" }}>Студенты ({students.length})</legend>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th style={{ width: 40 }}>№</th>
            <th>ФИО</th>
            <th>Тема</th>
            <th style={{ width: 70 }}>Гражд.</th>
            <th style={{ width: 130 }}>Оценка</th>
            <th style={{ width: 60 }}>Отл.</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {students.map((s, idx) => (
            <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ textAlign: "center" }}>{s.seq_no}</td>
              <td>
                <input
                  style={{ width: "100%" }}
                  value={s.full_name}
                  onChange={(e) => update(idx, { full_name: e.target.value })}
                />
              </td>
              <td>
                <textarea
                  rows={2}
                  style={{ width: "100%" }}
                  value={s.thesis_topic || ""}
                  onChange={(e) => update(idx, { thesis_topic: e.target.value })}
                />
              </td>
              <td>
                <input
                  style={{ width: "100%" }}
                  value={s.citizenship || ""}
                  onChange={(e) => update(idx, { citizenship: e.target.value })}
                />
              </td>
              <td>
                <select
                  style={{ width: "100%" }}
                  value={s.grade || ""}
                  onChange={(e) => update(idx, { grade: e.target.value })}
                >
                  <option value="">—</option>
                  {GRADES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </td>
              <td style={{ textAlign: "center" }}>
                <input
                  type="checkbox"
                  checked={!!s.with_honors}
                  onChange={(e) => update(idx, { with_honors: e.target.checked })}
                />
              </td>
              <td>
                <button onClick={() => remove(idx)}>✕</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={add} style={{ marginTop: 10 }}>
        + Добавить студента
      </button>
    </fieldset>
  );
}