export interface Member {
  role: "chairman" | "deputy" | "member" | "secretary";
  full_name: string;
  short_name?: string;
  degree?: string;
  workplace?: string;
  position?: string;
  sort_order?: number;
}

export interface Student {
  seq_no: number;
  full_name: string;
  full_name_dative?: string;
  citizenship?: string;
  study_form?: string;
  thesis_topic?: string;
  supervisor?: string;
  qualification?: string;
  grade?: string;
  with_honors?: boolean;
}

export interface SessionData {
  id?: number;
  number: number;
  specialty_id?: number | null;
  education_level: string;
  study_form?: string;
  work_type?: string;
  region?: string;
  event_date?: string;
  order_admission?: string;
  order_date?: string;
  members: Member[];
  students: Student[];
}

export interface ParsedMeta {
  gek_number?: number;
  specialty?: string;
}

export interface ParseResult {
  meta: ParsedMeta;
  students: Student[];
}

export interface DocType {
  type: string;
  title: string;
}

export const ROLE_LABELS: Record<Member["role"], string> = {
  chairman: "Председатель ГЭК",
  deputy: "Зам. председателя",
  member: "Член ГЭК",
  secretary: "Секретарь ГЭК",
};

export const GRADES = [
  "отлично",
  "хорошо",
  "удовлетворительно",
  "неудовлетворительно",
];