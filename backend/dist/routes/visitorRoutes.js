"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const visitorController_1 = require("../controllers/visitorController");
const auth_1 = require("../middlewares/auth");
const validate_1 = require("../middlewares/validate");
const router = (0, express_1.Router)();
// Security Guard (and Admin) can log visitor entry
router.post("/", auth_1.requireAuth, (0, auth_1.requireRoles)("guard", "admin"), (0, validate_1.requireFields)(["residentId", "fullName"]), visitorController_1.createVisitorHandler);
// Admin / Guard can view all visitors (with filters/pagination)
router.get("/", auth_1.requireAuth, (0, auth_1.requireRoles)("guard", "admin"), visitorController_1.listVisitorsHandler);
// Any authenticated user can view a visitor by id (with role-specific restrictions handled in controller if needed)
router.get("/:id", auth_1.requireAuth, visitorController_1.getVisitorHandler);
// Resident-only pending list (guards/admins also allowed)
router.get("/pending/:residentId", auth_1.requireAuth, (0, auth_1.requireRoles)("resident", "guard", "admin"), visitorController_1.getPendingVisitorsHandler);
// Update visitor status (guard/admin)
router.put("/:id/status", auth_1.requireAuth, (0, auth_1.requireRoles)("guard", "admin"), (0, validate_1.requireFields)(["status"]), visitorController_1.updateVisitorStatusHandler);
// Resident history (resident can access own; guard/admin can access any)
router.get("/history/:residentId", auth_1.requireAuth, (0, auth_1.requireRoles)("resident", "guard", "admin"), visitorController_1.getVisitorHistoryHandler);
// Get pending visitors count (for notifications)
router.get("/pending-count/:residentId", auth_1.requireAuth, (0, auth_1.requireRoles)("resident", "guard", "admin"), visitorController_1.getPendingVisitorsCountHandler);
exports.default = router;
//# sourceMappingURL=visitorRoutes.js.map