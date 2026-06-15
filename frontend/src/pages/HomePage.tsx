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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Сессии ГЭК</h2>
        <Link to="/session/new">
          <button style={{ padding: "8px 16px" }}>+ Новая сессия</button>
        </Link>
      </div>

      {loading && <p>Загрузка…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && sessions.length === 0 && (
        <p style={{ color: "#777" }}>Нет сохранённых сессий. Создайте новую.</p>
      )}

      {sessions.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
          <thead>
            <tr style={{ background: "#f0f0f0" }}>
              <th style={{ padding: 8, textAlign: "left" }}>№ ГЭК</th>
              <th style={{ padding: 8, textAlign: "left" }}>Тип работы</th>
              <th style={{ padding: 8, textAlign: "left" }}>Дата</th>
              <th style={{ padding: 8, textAlign: "left" }}>Студентов</th>
              <th style={{ padding: 8 }}></th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: 8 }}>№ {s.number}</td>
                <td style={{ padding: 8 }}>{s.work_type || "—"}</td>
                <td style={{ padding: 8 }}>{s.event_date || "—"}</td>
                <td style={{ padding: 8 }}>{s.students?.length ?? 0}</td>
                <td style={{ padding: 8, textAlign: "right" }}>
                  <Link to={`/session/${s.id}`}>
                    <button style={{ marginRight: 8 }}>Открыть</button>
                  </Link>
                  <button
                    onClick={() => s.id && handleDelete(s.id)}
                    style={{ color: "red" }}
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