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
exports.getDepotById = exports.getDepots = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient(); // Assurez-vous que le chemin est correct
// Récupérer tous les dépôts
const getDepots = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const depots = yield prisma.depot.findMany({
            include: {
                jeux: true, // Inclure les jeux associés
                vendeur: true, // Inclure les informations du vendeur
            },
        });
        res.status(200).json(depots);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la récupération des dépôts." });
    }
});
exports.getDepots = getDepots;
// Récupérer un dépôt par ID
const getDepotById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const depot = yield prisma.depot.findUnique({
            where: { ID_depot: Number(id) },
            include: {
                jeux: true,
                vendeur: true,
            },
        });
        if (!depot) {
            res.status(404).json({ error: "Dépôt non trouvé." });
            return;
        }
        res.status(200).json(depot);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la récupération du dépôt." });
    }
});
exports.getDepotById = getDepotById;
//On a besoin de que de récupérer tous les depots et voir la liste de tous les depots faites/ou voir le détail d'un dépot particulier 
//On a pas besoin de supprimer ni de update un depot,puisque ça fait partie de l'historique de notre app 
