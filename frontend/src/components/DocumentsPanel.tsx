import { useEffect, useState } from "react";
import { getDocTypes, downloadDocument } from "../api";
import type { DocType } from "../types";

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
    <fieldset style={{ marginBottom: 20, border: "1px solid #2c5", borderRadius: 8 }}>
      <legend style={{ fontWeight: "bold" }}>Генерация документов</legend>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {types.map((t) => (
          <button
            key={t.type}
            onClick={() => generate(t.type)}
            disabled={busy === t.type}
            style={{
              padding: "10px 16px",
              border: "1px solid #2c5",
              borderRadius: 6,
              background: busy === t.type ? "#eee" : "#f6fff6",
              cursor: "pointer",
            }}
          >
            {busy === t.type ? "⏳ " : "📥 "}
            {t.title}
          </button>
        ))}
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </fieldset>
  );
}