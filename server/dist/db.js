// server/src/db.ts
import { v4 as uuid } from "uuid";
export const db = {
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
export function newId(prefix) {
    // Lấy 6 ký tự hex đầu tiên (bỏ dấu gạch) cho gọn
    const short = uuid().replace(/-/g, "").slice(0, 6).toUpperCase();
    return `${prefix}-${short}`;
}
