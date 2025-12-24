"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccessToken = exports.signAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const ACCESS_TOKEN_EXPIRES_IN = "1d";
const signAccessToken = (user) => {
    const payload = {
        sub: user.id,
        role: user.role,
        email: user.email,
    };
    return jsonwebtoken_1.default.sign(payload, env_1.env.jwtSecret, {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
};
exports.signAccessToken = signAccessToken;
const verifyAccessToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, env_1.env.jwtSecret);
    }
    catch (_err) {
        return null;
    }
};
exports.verifyAccessToken = verifyAccessToken;
//# sourceMappingURL=jwt.js.map