import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createSession, getSession } from "../api";
import type { SessionData, Member, Student, ParseResult } from "../types";
import FileUpload from "../components/FileUpload";
import SessionForm from "../components/SessionForm";
import MembersEditor from "../components/MembersEditor";
import StudentsTable from "../components/StudentsTable";
import DocumentsPanel from "../components/DocumentsPanel";

const EMPTY_SESSION: SessionData = {
  number: 1,
  specialty_id: null,
  education_level: "СПО",
  study_form: "очная",
  work_type: "Дипломный проект",
  region: "Москва",
  event_date: "",
  members: [
    { role: "chairman", full_name: "", short_name: "", sort_order: 0 },
    { role: "secretary", full_name: "", short_name: "", sort_order: 1 },
  ],
  students: [],
};

export default function SessionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [data, setData] = useState<SessionData>(EMPTY_SESSION);
  const [savedId, setSavedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getSession(Number(id))
      .then((s) => {
        setData(s);
        setSavedId(s.id ?? null);
      })
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, [id]);

  function patch(p: Partial<SessionData>) {
    setData((prev) => ({ ...prev, ...p }));
  }

  function handleParsed(result: ParseResult) {
    patch({
      number: result.meta.gek_number ?? data.number,
      students: result.students.map((s, i) => ({
        ...s,
        seq_no: s.seq_no ?? i + 1,
      })),
    });
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const saved = await createSession(data);
      setSavedId(saved.id ?? null);
      if (!isEdit && saved.id) {
        navigate(`/session/${saved.id}`, { replace: true });
      }
      alert("Сессия сохранена");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Загрузка…</p>;

  return (
    <div>
      <h2>{isEdit ? `Сессия ГЭК № ${data.number}` : "Новая сессия ГЭК"}</h2>

      {!isEdit && <FileUpload onParsed={handleParsed} />}

      <SessionForm data={data} onChange={patch} />

      <MembersEditor
        members={data.members}
        onChange={(members: Member[]) => patch({ members })}
      />

      <StudentsTable
        students={data.students}
        onChange={(students: Student[]) => patch({ students })}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginBottom: 20 }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{ padding: "10px 20px", fontWeight: "bold" }}
        >
          {saving ? "Сохранение…" : "💾 Сохранить сессию"}
        </button>
      </div>

      {savedId ? (
        <DocumentsPanel sessionId={savedId} />
      ) : (
        <p style={{ color: "#777" }}>
          Сохраните сессию, чтобы сгенерировать документы.
        </p>
      )}
    </div>
  );
}