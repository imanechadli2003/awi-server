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
exports.getAllSessions = exports.getActiveSession = exports.closeSession = exports.createSession = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Contrôleur pour créer une session
const createSession = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Vérifier s'il y a une session active
        const activeSession = yield prisma.session.findFirst({
            where: { Statut: true },
        });
        if (activeSession) {
            res.status(400).json({ error: "Une session est déjà active." });
            return;
        }
        const { NomSession, pourc_frais_depot, pourc_frais_vente } = req.body;
        const newSession = yield prisma.session.create({
            data: {
                NomSession,
                DateDebut: new Date(),
                pourc_frais_depot,
                pourc_frais_vente,
                Statut: true,
            },
        });
        res.status(201).json(newSession);
    }
    catch (error) {
        console.error("Erreur lors de la création de la session :", error);
        next(error); // Passer l'erreur au middleware de gestion des erreurs
    }
});
exports.createSession = createSession;
// Contrôleur pour fermer une session
const closeSession = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const activeSession = yield prisma.session.findFirst({
            where: { Statut: true },
        });
        if (!activeSession) {
            res.status(400).json({ error: "Aucune session active à fermer." });
            return;
        }
        const closedSession = yield prisma.session.update({
            where: { idSession: activeSession.idSession },
            data: {
                Statut: false,
                DateFin: new Date(),
            },
        });
        res.status(200).json(closedSession);
    }
    catch (error) {
        console.error("Erreur lors de la fermeture de la session :", error);
        next(error);
    }
});
exports.closeSession = closeSession;
// Contrôleur pour récupérer la session active
const getActiveSession = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const activeSession = yield prisma.session.findFirst({
            where: { Statut: true },
        });
        if (!activeSession) {
            res.status(404).json({ error: "Aucune session active." });
            return;
        }
        res.status(200).json(activeSession);
    }
    catch (error) {
        console.error("Erreur lors de la récupération de la session active :", error);
        next(error);
    }
});
exports.getActiveSession = getActiveSession;
const getAllSessions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sessions = yield prisma.session.findMany({
            orderBy: { DateDebut: "desc" }, // Trier par date de début décroissante
        });
        res.status(200).json(sessions);
    }
    catch (error) {
        console.error("Error fetching sessions:", error);
        res.status(500).json({ error: "Erreur lors de la récupération des sessions." });
    }
});
exports.getAllSessions = getAllSessions;
