"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenValidation = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var tokenValidation = function (req, res, next) {
    var token = req.get('token');
    jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(401).json({
                ok: false,
                message: err
            });
        }
        req.user = decoded.user;
        next();
    });
};
exports.tokenValidation = tokenValidation;
