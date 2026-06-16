import type { SessionData, ParseResult, DocType } from "./types";

const BASE = import.meta.env.VITE_API_BASE || "/api";

async function handle<T>(r: Response): Promise<T> {
  if (!r.ok) {
    let msg = `Ошибка ${r.status}`;
    try {
      const data = await r.json();
      msg = data.detail || msg;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  return r.json() as Promise<T>;
}

export async function uploadStudents(file: File): Promise<ParseResult> {
  const fd = new FormData();
  fd.append("file", file);
  const r = await fetch(`${BASE}/upload/students`, {
    method: "POST",
    body: fd,
  });
  return handle<ParseResult>(r);
}

export async function createSession(data: SessionData): Promise<SessionData> {
  const payload = {
    ...data,
    event_date: data.event_date || null,
    order_date: data.order_date || null,
    order_admission: data.order_admission || null,
    study_form: data.study_form || null,
    work_type: data.work_type || null,
    number: Number(data.number) || 1,
  };

  const r = await fetch(`${BASE}/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handle<SessionData>(r);
}

export async function getSession(id: number): Promise<SessionData> {
  const r = await fetch(`${BASE}/sessions/${id}`);
  return handle<SessionData>(r);
}

export async function listSessions(): Promise<SessionData[]> {
  const r = await fetch(`${BASE}/sessions`);
  return handle<SessionData[]>(r);
}

export async function deleteSession(id: number): Promise<void> {
  const r = await fetch(`${BASE}/sessions/${id}`, { method: "DELETE" });
  await handle<unknown>(r);
}

export async function getDocTypes(): Promise<DocType[]> {
  const r = await fetch(`${BASE}/documents/types`);
  return handle<DocType[]>(r);
}

export async function downloadDocument(
  sessionId: number,
  docType: string
): Promise<void> {
  const r = await fetch(`${BASE}/documents/${sessionId}/${docType}`);
  if (!r.ok) {
    throw new Error("Не удалось сгенерировать документ");
  }
  const blob = await r.blob();
  const cd = r.headers.get("Content-Disposition") || "";
  const match = cd.match(/filename="?([^"]+)"?/);
  const filename = match ? match[1] : `${docType}.xlsx`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}