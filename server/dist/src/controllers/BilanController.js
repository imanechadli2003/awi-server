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
exports.obtenirBilanVendeurSession = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const obtenirBilanVendeurSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { vendeurId, sessionId } = req.params;
    if (!vendeurId || !sessionId) {
        res.status(400).json({ error: "vendeurId et sessionId sont requis." });
        return;
    }
    try {
        // Vérification de l'existence du vendeur
        const vendeur = yield prisma.vendeur.findUnique({
            where: { VendeurID: parseInt(vendeurId) },
        });
        if (!vendeur) {
            res.status(404).json({ error: "Vendeur non trouvé." });
            return;
        }
        // Vérification de l'existence de la session
        const session = yield prisma.session.findUnique({
            where: { idSession: parseInt(sessionId) },
        });
        if (!session) {
            res.status(404).json({ error: "Session non trouvée." });
            return;
        }
        // Récupération du bilan
        const bilan = yield prisma.bilanVendeurSession.findUnique({
            where: {
                id_vendeur_id_session: {
                    id_vendeur: parseInt(vendeurId),
                    id_session: parseInt(sessionId),
                },
            },
        });
        if (!bilan) {
            res.status(404).json({
                error: "Aucun bilan trouvé pour ce vendeur et cette session.",
            });
            return;
        }
        res.status(200).json({
            BilanVendeurSession: {
                total_depots: bilan.total_depots,
                total_ventes: bilan.total_ventes,
                total_stocks: bilan.total_stocks,
                total_gains: bilan.total_gains,
                total_comissions: bilan.total_comissions,
            },
        });
    }
    catch (error) {
        console.error("Erreur lors de la récupération du bilan:", error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});
exports.obtenirBilanVendeurSession = obtenirBilanVendeurSession;
