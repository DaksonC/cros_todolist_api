"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretKey = process.env.SECRET_KEY || '';
function generateToken(data) {
    return jsonwebtoken_1.default.sign(data, secretKey, { expiresIn: '1h' });
}
exports.generateToken = generateToken;
function verifyToken(token) {
    return jsonwebtoken_1.default.verify(token, secretKey);
}
exports.verifyToken = verifyToken;
function authenticate(req, res, next) {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            throw new Error('Token não fornecido');
        }
        const data = verifyToken(token);
        req.userId = data.userId;
        next();
    }
    catch (error) {
        res.status(401).json({ error: error.message });
    }
}
exports.authenticate = authenticate;
