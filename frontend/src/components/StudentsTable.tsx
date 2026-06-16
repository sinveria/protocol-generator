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
    <fieldset className="card">
      <legend>Студенты ({students.length})</legend>
      <table className="table">
        <thead>
          <tr>
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
            <tr key={idx}>
              <td className="text-center">{s.seq_no}</td>
              <td>
                <input
                  className="input"
                  value={s.full_name}
                  onChange={(e) => update(idx, { full_name: e.target.value })}
                />
              </td>
              <td>
                <textarea
                  className="textarea"
                  rows={2}
                  value={s.thesis_topic || ""}
                  onChange={(e) => update(idx, { thesis_topic: e.target.value })}
                />
              </td>
              <td>
                <input
                  className="input"
                  value={s.citizenship || ""}
                  onChange={(e) => update(idx, { citizenship: e.target.value })}
                />
              </td>
              <td>
                <select
                  className="select"
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
              <td className="text-center">
                <input
                  type="checkbox"
                  checked={!!s.with_honors}
                  onChange={(e) => update(idx, { with_honors: e.target.checked })}
                />
              </td>
              <td className="text-center">
                <button className="btn btn-icon" onClick={() => remove(idx)}>
                  ×
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn mt-10" onClick={add}>
        + Добавить студента
      </button>
    </fieldset>
  );
}