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
exports.getVendeurs = exports.getJeux = exports.mettreEnVente = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient(); // Ensure you're importing Prisma Client correctly
// 2. Mettre un jeu en vente
const mettreEnVente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { jeuID, sessionID } = req.body;
    try {
        // Vérifier si la session existe
        const sessionExist = yield prisma.session.findUnique({
            where: { idSession: sessionID },
            include: { depots: { include: { jeux: true } } },
        });
        if (!sessionExist) {
            return res.status(404).json({ message: 'Session non trouvée.' });
        }
        // Trouver le jeu dans la session
        const jeuExist = sessionExist.depots.flatMap(depot => depot.jeux).find(jeu => jeu.JeuID === jeuID);
        if (!jeuExist) {
            return res.status(404).json({ message: 'Jeu non trouvé dans cette session.' });
        }
        // Marquer le jeu comme "en vente"
        const jeuMisEnVente = yield prisma.jeu.update({
            where: { JeuID: jeuID },
            data: { mise_en_vente: true }, // Marquer le jeu comme en vente
        });
        return res.status(200).json({
            message: 'Jeu mis en vente avec succès.',
            jeu: jeuMisEnVente,
        });
    }
    catch (error) {
        console.error("Erreur lors de la mise en vente du jeu:", error);
        return res.status(500).json({ message: "Erreur interne du serveur." });
    }
});
exports.mettreEnVente = mettreEnVente;
// 3. Récupérer les jeux d'un dépôt
const getJeux = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sessionID } = req.params;
    try {
        // Récupérer la session et ses jeux
        const session = yield prisma.session.findUnique({
            where: { idSession: parseInt(sessionID) },
            include: { depots: { include: { jeux: true } } },
        });
        if (!session) {
            return res.status(404).json({ message: 'Session non trouvée.' });
        }
        const jeux = session.depots.flatMap(depot => depot.jeux);
        return res.status(200).json(jeux);
    }
    catch (error) {
        console.error("Erreur lors de la récupération des jeux:", error);
        return res.status(500).json({ message: "Erreur interne du serveur." });
    }
});
exports.getJeux = getJeux;
// 4. Récupérer tous les vendeurs
const getVendeurs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendeurs = yield prisma.vendeur.findMany();
        return res.status(200).json(vendeurs);
    }
    catch (error) {
        console.error("Erreur lors de la récupération des vendeurs:", error);
        return res.status(500).json({ message: "Erreur interne du serveur." });
    }
});
exports.getVendeurs = getVendeurs;
