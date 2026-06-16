import type { Member } from "../types";
import { ROLE_LABELS } from "../types";

interface Props {
  members: Member[];
  onChange: (members: Member[]) => void;
}

const ROLES: Member["role"][] = ["chairman", "deputy", "member", "secretary"];

export default function MembersEditor({ members, onChange }: Props) {
  function update(idx: number, patch: Partial<Member>) {
    const next = members.map((m, i) => (i === idx ? { ...m, ...patch } : m));
    onChange(next);
  }

  function add() {
    onChange([
      ...members,
      { role: "member", full_name: "", short_name: "", sort_order: members.length },
    ]);
  }

  function remove(idx: number) {
    onChange(members.filter((_, i) => i !== idx));
  }

  return (
    <fieldset style={{ marginBottom: 20, border: "1px solid #ccc", borderRadius: 8 }}>
      <legend style={{ fontWeight: "bold" }}>Состав комиссии</legend>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th>Роль</th>
            <th>ФИО (полностью)</th>
            <th>Краткое (Иванов И.И.)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {members.map((m, idx) => (
            <tr key={idx}>
              <td>
                <select
                  value={m.role}
                  onChange={(e) => update(idx, { role: e.target.value as Member["role"] })}
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {ROLE_LABELS[r]}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  style={{ width: "100%" }}
                  value={m.full_name}
                  onChange={(e) => update(idx, { full_name: e.target.value })}
                />
              </td>
              <td>
                <input
                  style={{ width: "100%" }}
                  value={m.short_name || ""}
                  onChange={(e) => update(idx, { short_name: e.target.value })}
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
        + Добавить члена комиссии
      </button>
    </fieldset>
  );
}