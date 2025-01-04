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
exports.getActiveSession = exports.closeSession = exports.createSession = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Contrôleur pour créer une session
const createSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Vérifier s'il y a une session active
        const activeSession = yield prisma.session.findFirst({
            where: {
                Statut: true, // Vérifie si une session est active
            },
        });
        if (activeSession) {
            return res.status(400).json({ error: "Une session est déjà active." });
        }
        const { NomSession, pourc_frais_depot, pourc_frais_vente } = req.body;
        const newSession = yield prisma.session.create({
            data: {
                NomSession,
                DateDebut: new Date(),
                pourc_frais_depot,
                pourc_frais_vente,
                Statut: true, // Marque la session comme active
            },
        });
        return res.status(201).json(newSession); // Change void to Response
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erreur lors de la création de la session." }); // Change void to Response
    }
});
exports.createSession = createSession;
// Contrôleur pour fermer une session
const closeSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Vérifier s'il y a une session active
        const activeSession = yield prisma.session.findFirst({
            where: {
                Statut: true, // Vérifie si une session est active
            },
        });
        if (!activeSession) {
            return res.status(400).json({ error: "Aucune session active à fermer." });
        }
        // Mettre à jour la session active pour la fermer
        const closedSession = yield prisma.session.update({
            where: {
                idSession: activeSession.idSession,
            },
            data: {
                Statut: false, // Change le statut à false
                DateFin: new Date(), // Enregistre la date de fin
            },
        });
        return res.status(200).json(closedSession); // Change void to Response
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erreur lors de la fermeture de la session." }); // Change void to Response
    }
});
exports.closeSession = closeSession;
// Contrôleur pour récupérer la session active
const getActiveSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Récupérer la session active
        const activeSession = yield prisma.session.findFirst({
            where: {
                Statut: true, // Vérifie si une session est active
            },
        });
        if (!activeSession) {
            return res.status(404).json({ error: "Aucune session active." });
        }
        return res.status(200).json(activeSession); // Retourner la session active
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erreur lors de la récupération de la session active." });
    }
});
exports.getActiveSession = getActiveSession;
