"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPendingVisitorsCountForResident = exports.getVisitorHistoryForResident = exports.updateVisitorStatus = exports.getPendingVisitorsForResident = exports.getVisitorById = exports.getVisitors = exports.createVisitor = void 0;
const db_1 = require("../config/db");
const mapRow = (row) => ({
    id: row.id,
    residentId: row.resident_id,
    fullName: row.full_name,
    phone: row.phone ?? undefined,
    purpose: row.purpose ?? undefined,
    status: row.status,
    expectedAt: row.expected_at ?? undefined,
    arrivedAt: row.arrived_at ?? undefined,
    checkedInAt: row.checked_in_at ?? undefined,
    checkedOutAt: row.checked_out_at ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
});
const createVisitor = async (input) => {
    const [result] = await db_1.db.execute(`INSERT INTO visitors_parcels (
       resident_id, full_name, phone, purpose, status, expected_at, record_type
     ) VALUES (:resident_id, :full_name, :phone, :purpose, :status, :expected_at, 'visitor')`, {
        resident_id: input.residentId,
        full_name: input.fullName,
        phone: input.phone ?? null,
        purpose: input.purpose ?? null,
        status: "new",
        expected_at: input.expectedAt ?? null,
    });
    const newId = result.insertId;
    const created = await (0, exports.getVisitorById)(newId);
    if (!created)
        throw new Error("Failed to load created visitor");
    return created;
};
exports.createVisitor = createVisitor;
const getVisitors = async (filters = {}) => {
    const where = ["record_type = 'visitor'"];
    const params = {};
    if (filters.residentId !== undefined) {
        where.push("resident_id = :resident_id");
        params.resident_id = filters.residentId;
    }
    if (filters.status !== undefined) {
        where.push("status = :status");
        params.status = filters.status;
    }
    const [rows] = await db_1.db.query(`SELECT id, resident_id, full_name, phone, purpose, status, expected_at, arrived_at, checked_in_at, checked_out_at, created_at, updated_at
     FROM visitors_parcels
     WHERE ${where.join(" AND ")}
     ORDER BY created_at DESC`, params);
    return rows.map(mapRow);
};
exports.getVisitors = getVisitors;
const getVisitorById = async (id) => {
    const [rows] = await db_1.db.query(`SELECT id, resident_id, full_name, phone, purpose, status, expected_at, arrived_at, checked_in_at, checked_out_at, created_at, updated_at
     FROM visitors_parcels
     WHERE id = :id AND record_type = 'visitor'
     LIMIT 1`, { id });
    if (!rows.length)
        return null;
    return mapRow(rows[0]);
};
exports.getVisitorById = getVisitorById;
const getPendingVisitorsForResident = async (residentId) => {
    const [rows] = await db_1.db.query(`SELECT id, resident_id, full_name, phone, purpose, status, expected_at, arrived_at, checked_in_at, checked_out_at, created_at, updated_at
     FROM visitors_parcels
     WHERE resident_id = :resident_id AND record_type = 'visitor' AND status IN ('new','waiting_approval','approved')
     ORDER BY created_at DESC`, { resident_id: residentId });
    return rows.map(mapRow);
};
exports.getPendingVisitorsForResident = getPendingVisitorsForResident;
const updateVisitorStatus = async (input) => {
    await db_1.db.execute(`UPDATE visitors_parcels
     SET status = :status,
         arrived_at = COALESCE(:arrived_at, arrived_at),
         checked_in_at = COALESCE(:checked_in_at, checked_in_at),
         checked_out_at = COALESCE(:checked_out_at, checked_out_at)
     WHERE id = :id AND record_type = 'visitor'`, {
        id: input.id,
        status: input.status,
        arrived_at: input.arrivedAt ?? null,
        checked_in_at: input.checkedInAt ?? null,
        checked_out_at: input.checkedOutAt ?? null,
    });
    return (0, exports.getVisitorById)(input.id);
};
exports.updateVisitorStatus = updateVisitorStatus;
const getVisitorHistoryForResident = async (residentId) => {
    const [rows] = await db_1.db.query(`SELECT id, resident_id, full_name, phone, purpose, status, expected_at, arrived_at, checked_in_at, checked_out_at, created_at, updated_at
     FROM visitors_parcels
     WHERE resident_id = :resident_id AND record_type = 'visitor'
     ORDER BY created_at DESC`, { resident_id: residentId });
    return rows.map(mapRow);
};
exports.getVisitorHistoryForResident = getVisitorHistoryForResident;
const getPendingVisitorsCountForResident = async (residentId) => {
    const [rows] = await db_1.db.query(`SELECT COUNT(*) as count
     FROM visitors_parcels
     WHERE resident_id = :resident_id 
       AND record_type = 'visitor'
       AND status IN ('new', 'waiting_approval', 'approved')`, { resident_id: residentId });
    return rows[0]?.count || 0;
};
exports.getPendingVisitorsCountForResident = getPendingVisitorsCountForResident;
//# sourceMappingURL=visitorRepository.js.map