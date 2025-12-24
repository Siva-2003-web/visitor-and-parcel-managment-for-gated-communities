"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByCredentials = exports.getUserByEmail = exports.getUserById = exports.createUser = exports.verifyPassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../config/db");
const SALT_ROUNDS = 10;
const hashPassword = async (password) => {
    return bcrypt_1.default.hash(password, SALT_ROUNDS);
};
exports.hashPassword = hashPassword;
const verifyPassword = async (password, passwordHash) => {
    return bcrypt_1.default.compare(password, passwordHash);
};
exports.verifyPassword = verifyPassword;
const mapRowToUser = (row) => ({
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    passwordHash: row.password_hash,
    role: row.role,
    isActive: row.is_active === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
});
const createUser = async (input) => {
    const passwordHash = await (0, exports.hashPassword)(input.password);
    const role = input.role ?? "resident";
    const isActive = input.isActive ?? true;
    const [result] = await db_1.db.execute(`INSERT INTO users (full_name, email, password_hash, role, is_active)
     VALUES (:full_name, :email, :password_hash, :role, :is_active)`, {
        full_name: input.fullName,
        email: input.email,
        password_hash: passwordHash,
        role,
        is_active: isActive ? 1 : 0,
    });
    const newId = result.insertId;
    const created = await (0, exports.getUserById)(newId);
    if (!created) {
        throw new Error("Failed to load newly created user");
    }
    return created;
};
exports.createUser = createUser;
const getUserById = async (id) => {
    const [rows] = await db_1.db.query(`SELECT id, full_name, email, password_hash, role, is_active, created_at, updated_at
     FROM users WHERE id = :id LIMIT 1`, { id });
    if (!rows.length)
        return null;
    return mapRowToUser(rows[0]);
};
exports.getUserById = getUserById;
const getUserByEmail = async (email) => {
    const [rows] = await db_1.db.query(`SELECT id, full_name, email, password_hash, role, is_active, created_at, updated_at
     FROM users WHERE email = :email LIMIT 1`, { email });
    if (!rows.length)
        return null;
    return mapRowToUser(rows[0]);
};
exports.getUserByEmail = getUserByEmail;
const findUserByCredentials = async (email, password) => {
    const user = await (0, exports.getUserByEmail)(email);
    if (!user)
        return null;
    const matches = await (0, exports.verifyPassword)(password, user.passwordHash);
    return matches ? user : null;
};
exports.findUserByCredentials = findUserByCredentials;
//# sourceMappingURL=user.js.map