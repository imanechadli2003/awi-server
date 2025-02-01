"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AchatTrans_1 = require("../controllers/AchatTrans");
const router = (0, express_1.Router)();
router.post('/achat', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract selectedGames from the request body
        const selectedGames = req.body.selectedGames;
        // Call the createAchat function with selectedGames
        const achat = yield (0, AchatTrans_1.createAchat)(selectedGames);
        // Return a response with the created achat
        res.status(201).json(achat);
    }
    catch (error) {
        // Handle any errors that occur during the process
        console.error("Erreur lors de la création de l'achat :", error);
        res.status(500).json({ error: "Erreur lors de la création de l'achat" });
    }
}));
exports.default = router;
