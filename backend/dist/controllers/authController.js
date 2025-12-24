"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.me = exports.login = exports.register = void 0;
const user_1 = require("../models/user");
const jwt_1 = require("../utils/jwt");
const toPublicUser = (user) => ({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
});
const register = async (req, res) => {
    const { fullName, email, password, role } = req.body;
    // Validate required fields
    if (!fullName || !email || !password) {
        return res
            .status(400)
            .json({ message: "Full name, email, and password are required" });
    }
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }
    // Validate password strength
    if (password.length < 6) {
        return res
            .status(400)
            .json({ message: "Password must be at least 6 characters long" });
    }
    try {
        // Check if user already exists
        const existingUser = await (0, user_1.getUserByEmail)(email);
        if (existingUser) {
            return res
                .status(409)
                .json({ message: "User with this email already exists" });
        }
        // Default role to 'resident' for self-registration
        // Only admins should be able to create guard/admin users
        const userRole = role && ["resident", "guard"].includes(role) ? role : "resident";
        // Create new user
        const newUser = await (0, user_1.createUser)({
            fullName,
            email,
            password,
            role: userRole,
            isActive: true,
        });
        // Generate token
        const token = (0, jwt_1.signAccessToken)(newUser);
        return res.status(201).json({
            message: "Registration successful",
            token,
            user: toPublicUser(newUser),
        });
    }
    catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ message: "Failed to register user" });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    const user = await (0, user_1.findUserByCredentials)(email, password);
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    if (!user.isActive) {
        return res.status(403).json({ message: "User inactive" });
    }
    const token = (0, jwt_1.signAccessToken)(user);
    return res.json({ token, user: toPublicUser(user) });
};
exports.login = login;
const me = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    return res.json({ user: toPublicUser(req.user) });
};
exports.me = me;
const logout = async (_req, res) => {
    // Stateless JWT logout: client should discard token; server returns success.
    return res.json({ message: "Logged out" });
};
exports.logout = logout;
//# sourceMappingURL=authController.js.map