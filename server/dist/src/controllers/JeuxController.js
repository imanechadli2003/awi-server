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
exports.deleteJeu = exports.mettreEnVente = exports.getJeuById = exports.getAllJeuxEnVente = exports.getAllJeux = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Obtenir tous les jeux
const getAllJeux = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jeux = yield prisma.jeu.findMany({
            include: {
                depot: true, // Inclut les informations du dépôt
                jeuxMarque: true, // Inclut les informations de la marque
            },
        });
        res.status(200).json(jeux);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la récupération des jeux." });
    }
});
exports.getAllJeux = getAllJeux;
const getAllJeuxEnVente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jeuxEnVente = yield prisma.jeu.findMany({
            where: {
                mise_en_vente: true, // Filtre pour les jeux en vente
            },
            include: {
                depot: true, // Inclut les informations du dépôt
                jeuxMarque: true, // Inclut les informations de la marque
            },
        });
        res.status(200).json(jeuxEnVente);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la récupération des jeux en vente." });
    }
});
exports.getAllJeuxEnVente = getAllJeuxEnVente;
//  Obtenir un jeu par ID
const getJeuById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const jeu = yield prisma.jeu.findUnique({
            where: { JeuID: parseInt(id) },
            include: {
                depot: true,
                jeuxMarque: true,
            },
        });
        if (!jeu) {
            res.status(404).json({ error: "Jeu non trouvé." });
            return;
        }
        res.status(200).json(jeu);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la récupération du jeu." });
    }
});
exports.getJeuById = getJeuById;
// Mettre un jeu en vente (mise à jour de mise_en_vente à true)
const mettreEnVente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const updatedJeu = yield prisma.jeu.update({
            where: {
                JeuID: parseInt(id, 10),
            },
            data: {
                mise_en_vente: true,
            },
        });
        res.status(200).json(updatedJeu);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la mise en vente du jeu." });
    }
});
exports.mettreEnVente = mettreEnVente;
// Supprimer un jeu
const deleteJeu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.jeu.delete({
            where: { JeuID: parseInt(id) },
        });
        res.status(204).send(); // Pas de contenu à retourner
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la suppression du jeu." });
    }
});
exports.deleteJeu = deleteJeu;
//Voir la liste des jeux,détail d'un jeu particulier,mettre en vente,ou le supprimer de la base de données sont des trucs 
//qu'on aura besoin de faire 
