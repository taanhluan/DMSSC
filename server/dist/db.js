"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
exports.newId = newId;
// server/src/db.ts
const uuid_1 = require("uuid");
exports.db = {
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
function newId(prefix) {
    // Lấy 6 ký tự hex đầu tiên (bỏ dấu gạch) cho gọn
    const short = (0, uuid_1.v4)().replace(/-/g, "").slice(0, 6).toUpperCase();
    return `${prefix}-${short}`;
}
