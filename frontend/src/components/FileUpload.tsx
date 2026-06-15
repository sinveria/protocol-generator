import { useState } from "react";
import { uploadStudents } from "../api";
import type { ParseResult } from "../types";

interface Props {
  onParsed: (result: ParseResult) => void;
}

export default function FileUpload({ onParsed }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setError("");
    setLoading(true);
    try {
      const result = await uploadStudents(file);
      onParsed(result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ border: "2px dashed #aaa", borderRadius: 8, padding: 20, marginBottom: 20 }}>
      <label style={{ fontWeight: "bold" }}>
        Загрузить список студентов (.xls / .xlsx)
      </label>
      <div style={{ marginTop: 10 }}>
        <input type="file" accept=".xls,.xlsx" onChange={handleFile} disabled={loading} />
      </div>
      {fileName && <p style={{ color: "#555" }}>Файл: {fileName}</p>}
      {loading && <p>⏳ Разбираю файл…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}