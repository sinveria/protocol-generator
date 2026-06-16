import { useEffect, useState } from "react";
import { getDocTypes, downloadDocument } from "../../api";
import type { DocType } from "../../types";
import "./DocumentsPanel.css";

interface Props {
  sessionId: number;
}

export default function DocumentsPanel({ sessionId }: Props) {
  const [types, setTypes] = useState<DocType[]>([]);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getDocTypes().then(setTypes).catch((e) => setError(e.message));
  }, []);

  async function generate(docType: string) {
    setBusy(docType);
    setError("");
    try {
      await downloadDocument(sessionId, docType);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy("");
    }
  }

  return (
    <fieldset className="card">
      <legend>Генерация документов</legend>
      <div className="documents-grid">
        {types.map((t) => (
          <button
            key={t.type}
            className="btn doc-btn"
            onClick={() => generate(t.type)}
            disabled={busy === t.type}
          >
            {busy === t.type ? "Подготовка… " : ""}
            {t.title}
          </button>
        ))}
      </div>
      {error && <p className="error">{error}</p>}
    </fieldset>
  );
}