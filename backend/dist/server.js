"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./config/env");
const db_1 = require("./config/db");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const visitorRoutes_1 = __importDefault(require("./routes/visitorRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/auth", authRoutes_1.default);
app.use("/api/visitors", visitorRoutes_1.default);
app.get("/health", async (_req, res) => {
    try {
        const connection = await db_1.db.getConnection();
        await connection.ping();
        connection.release();
        res.status(200).json({ status: "ok", db: "reachable" });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: "Database unreachable" });
    }
});
app.use((req, res) => {
    res.status(404).json({ message: "Not found" });
});
app.use((err, _req, res, _next) => {
    // Minimal error handler for unexpected issues
    res.status(500).json({ message: err.message || "Internal server error" });
});
app.listen(env_1.env.port, () => {
    console.log(`Server listening on port ${env_1.env.port}`);
});
//# sourceMappingURL=server.js.map