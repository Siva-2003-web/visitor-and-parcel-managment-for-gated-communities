"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireFields = void 0;
const requireFields = (fields) => {
    return (req, res, next) => {
        const missing = fields.filter((f) => req.body?.[f] === undefined ||
            req.body?.[f] === null ||
            req.body?.[f] === "");
        if (missing.length) {
            return res
                .status(400)
                .json({ message: `Missing required fields: ${missing.join(", ")}` });
        }
        next();
    };
};
exports.requireFields = requireFields;
//# sourceMappingURL=validate.js.map