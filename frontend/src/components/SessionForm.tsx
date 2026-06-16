import type { SessionData } from "../types";

interface Props {
  data: SessionData;
  onChange: (patch: Partial<SessionData>) => void;
}

const inputStyle: React.CSSProperties = { width: "100%", padding: 6, boxSizing: "border-box" };
const cellStyle: React.CSSProperties = { padding: "4px 8px" };

export default function SessionForm({ data, onChange }: Props) {
  return (
    <fieldset style={{ marginBottom: 20, border: "1px solid #ccc", borderRadius: 8 }}>
      <legend style={{ fontWeight: "bold" }}>Данные ГЭК</legend>
      <table style={{ width: "100%" }}>
        <tbody>
          <tr>
            <td style={cellStyle}>№ ГЭК</td>
            <td style={cellStyle}>
              <input
                type="number"
                style={inputStyle}
                value={data.number || ""}
                onChange={(e) => onChange({ number: Number(e.target.value) })}
              />
            </td>
            <td style={cellStyle}>Дата проведения</td>
            <td style={cellStyle}>
              <input
                type="date"
                style={inputStyle}
                value={data.event_date || ""}
                onChange={(e) => onChange({ event_date: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td style={cellStyle}>Тип работы</td>
            <td style={cellStyle}>
              <select
                style={inputStyle}
                value={data.work_type || "Дипломный проект"}
                onChange={(e) => onChange({ work_type: e.target.value })}
              >
                <option>Дипломный проект</option>
                <option>Дипломная работа</option>
              </select>
            </td>
            <td style={cellStyle}>Форма обучения</td>
            <td style={cellStyle}>
              <select
                style={inputStyle}
                value={data.study_form || "очная"}
                onChange={(e) => onChange({ study_form: e.target.value })}
              >
                <option>очная</option>
                <option>очно-заочная</option>
                <option>заочная</option>
                <option>экстернат</option>
              </select>
            </td>
          </tr>
          <tr>
            <td style={cellStyle}>Уровень</td>
            <td style={cellStyle}>
              <select
                style={inputStyle}
                value={data.education_level}
                onChange={(e) => onChange({ education_level: e.target.value })}
              >
                <option>СПО</option>
                <option>ВПО</option>
              </select>
            </td>
            <td style={cellStyle}>Регион</td>
            <td style={cellStyle}>
              <input
                style={inputStyle}
                value={data.region || "Москва"}
                onChange={(e) => onChange({ region: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td style={cellStyle}>Приказ о допуске</td>
            <td style={cellStyle}>
              <input
                style={inputStyle}
                value={data.order_admission || ""}
                onChange={(e) => onChange({ order_admission: e.target.value })}
              />
            </td>
            <td style={cellStyle}>Дата приказа</td>
            <td style={cellStyle}>
              <input
                type="date"
                style={inputStyle}
                value={data.order_date || ""}
                onChange={(e) => onChange({ order_date: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </fieldset>
  );
}