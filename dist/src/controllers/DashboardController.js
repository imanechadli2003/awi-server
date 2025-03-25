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
exports.DashboardController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class DashboardController {
    // Méthode pour récupérer les informations du dashboard
    getDashboardStats() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Top 5 des meilleurs vendeurs basés sur les gains totaux
                const topSellers = yield prisma.bilanVendeurSession.findMany({
                    select: {
                        vendeur: {
                            select: {
                                Nom: true,
                                Email: true,
                            },
                        },
                        total_gains: true,
                    },
                    orderBy: {
                        total_gains: 'desc',
                    },
                    take: 5, // Limiter aux 5 meilleurs vendeurs
                });
                // Nombre total de jeux vendus
                const totalGamesSold = yield prisma.achatJeu.aggregate({
                    _sum: {
                        quantite_achete: true,
                    },
                });
                // Chiffre d'affaires total (total payé pour les achats)
                const totalRevenue = yield prisma.achat.aggregate({
                    _sum: {
                        Total_paye: true,
                    },
                });
                // Nombre total de vendeurs inscrits
                const totalSellers = yield prisma.vendeur.count();
                // Nombre total de jeux déposés
                const totalDepositedGames = yield prisma.depotJeu.aggregate({
                    _sum: {
                        quantite_depose: true,
                    },
                });
                // Top 5 des jeux les plus vendus
                const topGamesSold = yield prisma.achatJeu.groupBy({
                    by: ['JeuID'],
                    _sum: {
                        quantite_achete: true,
                    },
                    orderBy: {
                        _sum: {
                            quantite_achete: 'desc',
                        },
                    },
                    take: 5, // Limiter aux 5 jeux les plus vendus
                });
                // Récupérer les informations des jeux, y compris la relation avec JeuxMarque
                const gameDetails = yield prisma.jeu.findMany({
                    where: {
                        JeuID: {
                            in: topGamesSold.map(game => game.JeuID),
                        },
                    },
                    include: {
                        jeuxMarque: {
                            select: {
                                Nom: true, // Assurez-vous de sélectionner le Nom de la marque
                            },
                        },
                    },
                });
                // Mapper les données pour afficher les jeux avec leur marque
                const topGamesDetails = topGamesSold.map((game) => {
                    var _a, _b;
                    const gameInfo = gameDetails.find((g) => g.JeuID === game.JeuID);
                    return {
                        JeuNom: (_a = gameInfo === null || gameInfo === void 0 ? void 0 : gameInfo.jeuxMarque) === null || _a === void 0 ? void 0 : _a.Nom,
                        JeuMarque: (_b = gameInfo === null || gameInfo === void 0 ? void 0 : gameInfo.jeuxMarque) === null || _b === void 0 ? void 0 : _b.Nom, // La marque du jeu
                        QuantiteVendue: game._sum.quantite_achete,
                    };
                });
                // Rassembler les statistiques
                const dashboardStats = {
                    topSellers,
                    totalGamesSold: totalGamesSold._sum.quantite_achete,
                    totalRevenue: totalRevenue._sum.Total_paye,
                    totalSellers,
                    totalDepositedGames: totalDepositedGames._sum.quantite_depose,
                    topGamesDetails,
                };
                return dashboardStats;
            }
            catch (error) {
                console.error('Erreur dans la récupération des statistiques du tableau de bord:', error);
                throw new Error('Impossible de récupérer les statistiques');
            }
        });
    }
}
exports.DashboardController = DashboardController;
