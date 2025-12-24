"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../config/db");
const env_1 = require("../config/env");
// Simple connectivity check for the configured MySQL instance
const main = async () => {
    try {
        const [rows] = await db_1.db.query("SELECT 1 AS ok");
        console.log(`DB connection OK to ${env_1.env.db.host}:${env_1.env.db.port}/${env_1.env.db.database}`);
        console.log(rows);
        await db_1.db.end();
        process.exit(0);
    }
    catch (error) {
        console.error("DB connection failed:", error instanceof Error ? error.message : error);
        await db_1.db.end();
        process.exit(1);
    }
};
void main();
//# sourceMappingURL=test-db.js.map