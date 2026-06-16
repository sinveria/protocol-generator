import { useState } from "react";
import { uploadStudents } from "../../api";
import type { ParseResult } from "../../types";
import "./FileUpload.css";

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
    <div className="upload-zone">
      <label>Загрузить список студентов (.xls / .xlsx)</label>
      <div>
        <input type="file" accept=".xls,.xlsx" onChange={handleFile} disabled={loading} />
      </div>
      {fileName && <p className="upload-file">Файл: {fileName}</p>}
      {loading && <p className="muted">Разбираю файл…</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}