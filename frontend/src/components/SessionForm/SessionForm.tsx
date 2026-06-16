import type { SessionData } from "../../types";
import "./SessionForm.css";

interface Props {
  data: SessionData;
  onChange: (patch: Partial<SessionData>) => void;
}

export default function SessionForm({ data, onChange }: Props) {
  return (
    <fieldset className="card">
      <legend>Данные ГЭК</legend>
      <div className="form-grid">
        <label>№ ГЭК</label>
        <input
          type="number"
          className="input"
          value={data.number || ""}
          onChange={(e) => onChange({ number: Number(e.target.value) })}
        />

        <label>Дата проведения</label>
        <input
          type="date"
          className="input"
          value={data.event_date || ""}
          onChange={(e) => onChange({ event_date: e.target.value })}
        />

        <label>Тип работы</label>
        <select
          className="select"
          value={data.work_type || "Дипломный проект"}
          onChange={(e) => onChange({ work_type: e.target.value })}
        >
          <option>Дипломный проект</option>
          <option>Дипломная работа</option>
        </select>

        <label>Форма обучения</label>
        <select
          className="select"
          value={data.study_form || "очная"}
          onChange={(e) => onChange({ study_form: e.target.value })}
        >
          <option>очная</option>
          <option>очно-заочная</option>
          <option>заочная</option>
          <option>экстернат</option>
        </select>

        <label>Уровень</label>
        <select
          className="select"
          value={data.education_level}
          onChange={(e) => onChange({ education_level: e.target.value })}
        >
          <option>СПО</option>
          <option>ВПО</option>
        </select>

        <label>Регион</label>
        <input
          className="input"
          value={data.region || "Москва"}
          onChange={(e) => onChange({ region: e.target.value })}
        />

        <label>Приказ о допуске</label>
        <input
          className="input"
          value={data.order_admission || ""}
          onChange={(e) => onChange({ order_admission: e.target.value })}
        />

        <label>Дата приказа</label>
        <input
          type="date"
          className="input"
          value={data.order_date || ""}
          onChange={(e) => onChange({ order_date: e.target.value })}
        />
      </div>
    </fieldset>
  );
}