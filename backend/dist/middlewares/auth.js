"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRoles = exports.requireAuth = void 0;
const user_1 = require("../models/user");
const jwt_1 = require("../utils/jwt");
const extractToken = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return null;
    const [scheme, token] = authHeader.split(" ");
    if (scheme?.toLowerCase() !== "bearer" || !token)
        return null;
    return token;
};
const requireAuth = async (req, res, next) => {
    const token = extractToken(req);
    if (!token) {
        return res.status(401).json({ message: "Missing authorization token" });
    }
    const payload = (0, jwt_1.verifyAccessToken)(token);
    if (!payload) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
    const user = await (0, user_1.getUserById)(payload.sub);
    if (!user || !user.isActive) {
        return res.status(401).json({ message: "User not found or inactive" });
    }
    req.user = user;
    req.tokenPayload = payload;
    return next();
};
exports.requireAuth = requireAuth;
const requireRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        return next();
    };
};
exports.requireRoles = requireRoles;
//# sourceMappingURL=auth.js.map