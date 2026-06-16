import type { Member } from "../types";
import { ROLE_LABELS } from "../types";

interface Props {
  members: Member[];
  onChange: (members: Member[]) => void;
}

const ROLES: Member["role"][] = ["chairman", "deputy", "member", "secretary"];

export default function MembersEditor({ members, onChange }: Props) {
  function update(idx: number, patch: Partial<Member>) {
    onChange(members.map((m, i) => (i === idx ? { ...m, ...patch } : m)));
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
    <fieldset className="card">
      <legend>Состав комиссии</legend>
      <table className="table">
        <thead>
          <tr>
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
                  className="select"
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
                  className="input"
                  value={m.full_name}
                  onChange={(e) => update(idx, { full_name: e.target.value })}
                />
              </td>
              <td>
                <input
                  className="input"
                  value={m.short_name || ""}
                  onChange={(e) => update(idx, { short_name: e.target.value })}
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
        + Добавить члена комиссии
      </button>
    </fieldset>
  );
}