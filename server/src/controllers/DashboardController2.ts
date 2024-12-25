import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getDashboardMetrics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Récupération des jeux populaires (les jeux avec la plus grande quantité disponible)
    const popularGames = await prisma.jeu.findMany({
      take: 15,
      orderBy: {
        quantite_disponible: "desc",
        
        
      },
      include: {
        jeuxMarque: true, 
        achat_jeux:true,
      },
    });

    // Récupération des achats récents
    const salesSummary = await prisma.achat.findMany({
      take: 5,
      orderBy: {
        DateAchat: "desc",
      },
    });

    // Récupération des dépôts récents
    const depositSummary = await prisma.depot.findMany({
      take: 5,
      orderBy: {
        date_depot: "desc",
      },
    });

    // Calcul du stock total de jeux
    const totalStocked = await prisma.jeu.aggregate({
      _sum: {
        quantite_disponible: true,
      },
    });

    // Calcul du nombre total de jeux vendus
    const totalSold = await prisma.achatJeu.aggregate({
      _sum: {
        quantite_achete: true,
      },
    });

    // Calcul du nombre total de jeux invendus
    const totalUnsold = totalStocked._sum.quantite_disponible! - totalSold._sum.quantite_achete!;

    // Réponse avec les métriques
    res.json({
      popularGames,
      salesSummary,
      depositSummary,
      jeuxStockes: totalStocked._sum.quantite_disponible || 0,
      jeuxVendues: totalSold._sum.quantite_achete || 0,
      jeuxInvendus: totalUnsold || 0,  // Calcul basé sur la différence entre stock et ventes
    });
  } catch (error) {
    console.error(error);  // Ajouter un log pour aider à déboguer
    res.status(500).json({ message: "Error retrieving dashboard metrics" });
  }
};
