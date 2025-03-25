"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = void 0;
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next); // Si une erreur se produit, elle sera capturée par `next`
    };
};
exports.asyncHandler = asyncHandler;
