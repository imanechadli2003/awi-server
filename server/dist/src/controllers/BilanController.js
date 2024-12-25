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
exports.getBilanVendeurSession = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getBilanVendeurSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id_vendeur, id_session } = req.params;
        // Step 1: Calculate total_depots
        const totalDepotsResult = yield prisma.depotJeu.aggregate({
            where: {
                depot: {
                    VendeurID: Number(id_vendeur),
                    id_session: Number(id_session),
                },
            },
            _sum: {
                quantite_depose: true,
            },
        });
        const totalDepots = totalDepotsResult._sum.quantite_depose || 0;
        // Step 2: Calculate total_ventes
        const totalVentesResult = yield prisma.achatJeu.aggregate({
            where: {
                jeu: {
                    depot: {
                        VendeurID: Number(id_vendeur),
                        session: {
                            idSession: Number(id_session),
                        },
                    },
                },
            },
            _sum: {
                quantite_achete: true,
            },
        });
        const totalVentes = totalVentesResult._sum.quantite_achete || 0;
        // Step 3: Calculate total_stocks (remaining quantities in stock)
        const totalStocksResult = yield prisma.jeu.aggregate({
            where: {
                depot: {
                    VendeurID: Number(id_vendeur),
                    session: {
                        idSession: Number(id_session),
                    },
                },
            },
            _sum: {
                quantite_disponible: true,
            },
        });
        const totalStocks = totalStocksResult._sum.quantite_disponible || 0;
        // Step 4: Calculate total_gains and total_comissions
        const venteDetails = yield prisma.achatJeu.findMany({
            where: {
                jeu: {
                    depot: {
                        VendeurID: Number(id_vendeur),
                        session: {
                            idSession: Number(id_session),
                        },
                    },
                },
            },
            include: {
                achat: true,
                jeu: true,
            },
        });
        let totalGains = 0;
        let totalCommissions = 0;
        for (const vente of venteDetails) {
            const saleValue = vente.jeu.prix_unitaire * vente.quantite_achete;
            const commission = vente.comission_vente * vente.quantite_achete;
            totalGains += saleValue - commission;
            totalCommissions += commission;
        }
        // Respond with calculated metrics
        res.status(200).json({
            id_vendeur,
            id_session,
            total_depots: totalDepots,
            total_ventes: totalVentes,
            total_stocks: totalStocks,
            total_gains: totalGains,
            total_comissions: totalCommissions,
        });
    }
    catch (error) {
        console.error("Error fetching bilan:", error);
        res.status(500).json({ error: "Erreur lors de la récupération du bilan du vendeur." });
    }
});
exports.getBilanVendeurSession = getBilanVendeurSession;
