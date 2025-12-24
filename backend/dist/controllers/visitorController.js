"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPendingVisitorsCountHandler = exports.getVisitorHistoryHandler = exports.updateVisitorStatusHandler = exports.getPendingVisitorsHandler = exports.getVisitorHandler = exports.listVisitorsHandler = exports.createVisitorHandler = void 0;
const visitorRepository_1 = require("../models/visitorRepository");
const parsePage = (value, fallback) => {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
};
const createVisitorHandler = async (req, res) => {
    const { residentId, fullName, phone, purpose, expectedAt } = req.body;
    try {
        const visitor = await (0, visitorRepository_1.createVisitor)({
            residentId: Number(residentId),
            fullName,
            phone,
            purpose,
            expectedAt: expectedAt ? new Date(expectedAt) : undefined,
        });
        res.status(201).json({ visitor });
    }
    catch (err) {
        res.status(400).json({
            message: err instanceof Error ? err.message : "Could not create visitor",
        });
    }
};
exports.createVisitorHandler = createVisitorHandler;
const listVisitorsHandler = async (req, res) => {
    const { residentId, status, page = "1", pageSize = "20" } = req.query;
    const filters = {};
    if (residentId !== undefined)
        filters.residentId = Number(residentId);
    if (status !== undefined)
        filters.status = status;
    const pageNum = parsePage(page, 1);
    const sizeNum = parsePage(pageSize, 20);
    const all = await (0, visitorRepository_1.getVisitors)(filters);
    const start = (pageNum - 1) * sizeNum;
    const paged = all.slice(start, start + sizeNum);
    res.json({
        data: paged,
        total: all.length,
        page: pageNum,
        pageSize: sizeNum,
    });
};
exports.listVisitorsHandler = listVisitorsHandler;
const getVisitorHandler = async (req, res) => {
    const id = Number(req.params.id);
    const visitor = await (0, visitorRepository_1.getVisitorById)(id);
    if (!visitor)
        return res.status(404).json({ message: "Visitor not found" });
    res.json({ visitor });
};
exports.getVisitorHandler = getVisitorHandler;
const getPendingVisitorsHandler = async (req, res) => {
    const residentId = Number(req.params.residentId);
    // Enforce resident can only view their own pending list unless admin/guard
    if (req.user?.role === "resident" && req.user.id !== residentId) {
        return res.status(403).json({ message: "Forbidden" });
    }
    const visitors = await (0, visitorRepository_1.getPendingVisitorsForResident)(residentId);
    res.json({ visitors });
};
exports.getPendingVisitorsHandler = getPendingVisitorsHandler;
const updateVisitorStatusHandler = async (req, res) => {
    const id = Number(req.params.id);
    const { status, arrivedAt, checkedInAt, checkedOutAt } = req.body;
    const allowed = [
        "approved",
        "rejected",
        "entered",
        "exited",
        "waiting_approval",
    ];
    if (!allowed.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }
    const updated = await (0, visitorRepository_1.updateVisitorStatus)({
        id,
        status,
        arrivedAt: arrivedAt ? new Date(arrivedAt) : undefined,
        checkedInAt: checkedInAt ? new Date(checkedInAt) : undefined,
        checkedOutAt: checkedOutAt ? new Date(checkedOutAt) : undefined,
    });
    if (!updated)
        return res.status(404).json({ message: "Visitor not found" });
    res.json({ visitor: updated });
};
exports.updateVisitorStatusHandler = updateVisitorStatusHandler;
const getVisitorHistoryHandler = async (req, res) => {
    const residentId = Number(req.params.residentId);
    if (req.user?.role === "resident" && req.user.id !== residentId) {
        return res.status(403).json({ message: "Forbidden" });
    }
    const visitors = await (0, visitorRepository_1.getVisitorHistoryForResident)(residentId);
    res.json({ visitors });
};
exports.getVisitorHistoryHandler = getVisitorHistoryHandler;
const getPendingVisitorsCountHandler = async (req, res) => {
    const residentId = Number(req.params.residentId);
    // Enforce resident can only view their own count unless admin/guard
    if (req.user?.role === "resident" && req.user.id !== residentId) {
        return res.status(403).json({ message: "Forbidden" });
    }
    const count = await (0, visitorRepository_1.getPendingVisitorsCountForResident)(residentId);
    res.json({ count });
};
exports.getPendingVisitorsCountHandler = getPendingVisitorsCountHandler;
//# sourceMappingURL=visitorController.js.map