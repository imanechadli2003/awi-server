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
exports.getDashboardMetrics = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getDashboardMetrics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Récupération des jeux populaires (les jeux avec la plus grande quantité disponible)
        const popularGames = yield prisma.jeu.findMany({
            take: 15,
            orderBy: {
                quantite_disponible: "desc",
            },
            include: {
                jeuxMarque: true,
                achat_jeux: true,
            },
        });
        // Récupération des achats récents
        const salesSummary = yield prisma.achat.findMany({
            take: 5,
            orderBy: {
                DateAchat: "desc",
            },
        });
        // Récupération des dépôts récents
        const depositSummary = yield prisma.depot.findMany({
            take: 5,
            orderBy: {
                date_depot: "desc",
            },
        });
        // Calcul du stock total de jeux
        const totalStocked = yield prisma.jeu.aggregate({
            _sum: {
                quantite_disponible: true,
            },
        });
        // Calcul du nombre total de jeux vendus
        const totalSold = yield prisma.achatJeu.aggregate({
            _sum: {
                quantite_achete: true,
            },
        });
        // Calcul du nombre total de jeux invendus
        const totalUnsold = totalStocked._sum.quantite_disponible - totalSold._sum.quantite_achete;
        // Réponse avec les métriques
        res.json({
            popularGames,
            salesSummary,
            depositSummary,
            jeuxStockes: totalStocked._sum.quantite_disponible || 0,
            jeuxVendues: totalSold._sum.quantite_achete || 0,
            jeuxInvendus: totalUnsold || 0, // Calcul basé sur la différence entre stock et ventes
        });
    }
    catch (error) {
        console.error(error); // Ajouter un log pour aider à déboguer
        res.status(500).json({ message: "Error retrieving dashboard metrics" });
    }
});
exports.getDashboardMetrics = getDashboardMetrics;
