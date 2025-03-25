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
exports.VendeurController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class VendeurController {
    // Créer un nouveau vendeur
    static createVendeur(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Nom, Email, Telephone } = req.body;
            try {
                const newVendeur = yield prisma.vendeur.create({
                    data: {
                        Nom,
                        Email,
                        Telephone,
                    },
                });
                res.status(201).json(newVendeur);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Erreur lors de la création du vendeur.' });
            }
        });
    }
    // Récupérer tous les vendeurs
    static getAllVendeurs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendeurs = yield prisma.vendeur.findMany({
                    include: {
                        depots: true, // Inclure les dépôts associés
                    },
                });
                res.status(200).json(vendeurs);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Erreur lors de la récupération des vendeurs.' });
            }
        });
    }
    // Récupérer un vendeur par ID
    static getVendeurById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const vendeur = yield prisma.vendeur.findUnique({
                    where: { VendeurID: Number(id) },
                    include: {
                        depots: true, // Inclure les dépôts associés
                    },
                });
                if (!vendeur) {
                    res.status(404).json({ message: 'Vendeur non trouvé.' });
                    return;
                }
                res.status(200).json(vendeur);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Erreur lors de la récupération du vendeur.' });
            }
        });
    }
    // Mettre à jour un vendeur par ID
    static updateVendeur(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { Nom, Email, Telephone, Balance } = req.body;
            try {
                const updatedVendeur = yield prisma.vendeur.update({
                    where: { VendeurID: Number(id) },
                    data: {
                        Nom,
                        Email,
                        Telephone,
                    },
                });
                res.status(200).json(updatedVendeur);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Erreur lors de la mise à jour du vendeur.' });
            }
        });
    }
    static getTopVendeurs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Étape 1 : Agréger les totaux de commissions pour chaque vendeur
                const vendeursAvecTotal = yield prisma.depot.groupBy({
                    by: ["VendeurID"], // Grouper par ID de vendeur
                    _sum: {
                        comission_depot_total: true, // Somme des commissions
                    },
                    orderBy: {
                        _sum: {
                            comission_depot_total: "desc", // Trier par ordre décroissant
                        },
                    },
                    take: 5, // Limiter aux 5 premiers vendeurs
                });
                // Étape 2 : Récupérer les détails des vendeurs correspondants
                const topVendeurs = yield prisma.vendeur.findMany({
                    where: {
                        VendeurID: {
                            in: vendeursAvecTotal.map((v) => v.VendeurID),
                        },
                    },
                    include: {
                        depots: true, // Inclure les dépôts si nécessaire
                    },
                });
                // Ajouter les totaux calculés aux vendeurs
                const result = topVendeurs.map((vendeur) => {
                    const total = vendeursAvecTotal.find((v) => v.VendeurID === vendeur.VendeurID);
                    return Object.assign(Object.assign({}, vendeur), { totalCommissions: (total === null || total === void 0 ? void 0 : total._sum.comission_depot_total) || 0 });
                });
                res.status(200).json(result);
            }
            catch (error) {
                console.error("Erreur lors de la récupération des meilleurs vendeurs : ", error);
                res.status(500).json({ message: "Erreur interne du serveur." });
            }
        });
    }
}
exports.VendeurController = VendeurController;
//on a besoin de creer un vendeur,retourner tous les vendeurs,recuperer un vendeur a partir de son ID
//et si on veut update les informations d'un vendeur on peut.
