"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const numberFromEnv = (value, fallback) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};
exports.env = {
    port: numberFromEnv(process.env.PORT, 3000),
    jwtSecret: process.env.JWT_SECRET || "change-me",
    db: {
        host: process.env.DB_HOST || "localhost",
        port: numberFromEnv(process.env.DB_PORT, 3306),
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "vpms",
    },
};
//# sourceMappingURL=env.js.map