import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DashboardController {

  // Méthode pour récupérer les informations du dashboard
  async getDashboardStats() {
    try {
      // Top 5 des meilleurs vendeurs basés sur les gains totaux
      const topSellers = await prisma.bilanVendeurSession.findMany({
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
      const totalGamesSold = await prisma.achatJeu.aggregate({
        _sum: {
          quantite_achete: true,
        },
      });

      // Chiffre d'affaires total (total payé pour les achats)
      const totalRevenue = await prisma.achat.aggregate({
        _sum: {
          Total_paye: true,
        },
      });

      // Nombre total de vendeurs inscrits
      const totalSellers = await prisma.vendeur.count();

      // Nombre total de jeux déposés
      const totalDepositedGames = await prisma.depotJeu.aggregate({
        _sum: {
          quantite_depose: true,
        },
      });

      // Top 5 des jeux les plus vendus
      const topGamesSold = await prisma.achatJeu.groupBy({
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
      const gameDetails = await prisma.jeu.findMany({
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
        const gameInfo = gameDetails.find((g) => g.JeuID === game.JeuID);
        return {
          JeuNom: gameInfo?.jeuxMarque?.Nom,
          JeuMarque: gameInfo?.jeuxMarque?.Nom,  // La marque du jeu
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

    } catch (error) {
      console.error('Erreur dans la récupération des statistiques du tableau de bord:', error);
      throw new Error('Impossible de récupérer les statistiques');
    }
  }
}
