// server/src/db.ts
import { v4 as uuid } from "uuid";

export type Task = {
  id: string;
  sr: string;
  title?: string | null;
  description?: string | null;
  site?: string | null;
  pic?: string | null;
  status: string;           // "NEW" | "TODO" | "DONE" | ...
  priority?: string | null; // "HIGH" | "MEDIUM" | ...
  startDate?: string | null;
  endDate?: string | null;
  hours?: number | null;
  [k: string]: any;
};

export type BacklogItem = {
  id: string;
  sr: string;
  description?: string | null;
  site?: string | null;
  status: string;
  owner?: string | null;
  priority?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  [k: string]: any;
};

export type DB = {
  backlog: BacklogItem[];
  tasks: Task[];
};

export const db: DB = {
  backlog: [
    {
      id: "BL-000001",
      sr: "SR-1001",
      description: "Setup skeleton",
      site: "DLVN",
      status: "NEW",
      owner: "Jonathan",
      priority: "HIGH",
      startDate: null,
      endDate: null
    }
  ],
  tasks: [
    {
      id: "TK-000001",
      sr: "SR-1001",
      title: "BS Working Hour",
      description: "init",
      site: "DLVN",
      pic: "Nga",
      status: "TODO",
      priority: "MEDIUM",
      startDate: null,
      endDate: null,
      hours: 0
    }
  ]
};

export function newId(prefix: string): string {
  // Lấy 6 ký tự hex đầu tiên (bỏ dấu gạch) cho gọn
  const short = uuid().replace(/-/g, "").slice(0, 6).toUpperCase();
  return `${prefix}-${short}`;
}
