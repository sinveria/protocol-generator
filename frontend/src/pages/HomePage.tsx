import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listSessions, deleteSession } from "../api";
import type { SessionData } from "../types";

export default function HomePage() {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await listSessions();
      setSessions(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("Удалить эту сессию ГЭК?")) return;
    try {
      await deleteSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (e) {
      alert((e as Error).message);
    }
  }

  return (
    <div>
      <div className="toolbar">
        <h2>Сессии ГЭК</h2>
        <Link to="/session/new">
          <button className="btn btn-primary">+ Новая сессия</button>
        </Link>
      </div>

      {loading && <p className="muted">Загрузка…</p>}
      {error && <p className="error">{error}</p>}

      {!loading && sessions.length === 0 && (
        <p className="muted">Нет сохранённых сессий. Создайте новую.</p>
      )}

      {sessions.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>№ ГЭК</th>
              <th>Тип работы</th>
              <th>Дата</th>
              <th>Студентов</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.id}>
                <td>№ {s.number}</td>
                <td>{s.work_type || "—"}</td>
                <td>{s.event_date || "—"}</td>
                <td>{s.students?.length ?? 0}</td>
                <td className="text-right">
                  <Link to={`/session/${s.id}`}>
                    <button className="btn btn-sm" style={{ marginRight: 8 }}>
                      Открыть
                    </button>
                  </Link>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => s.id && handleDelete(s.id)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}