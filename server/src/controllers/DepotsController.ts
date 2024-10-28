import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";// Assurez-vous que le chemin est correct

const prisma = new PrismaClient();// Assurez-vous que le chemin est correct

// Récupérer tous les dépôts
export const getDepots = async (req: Request, res: Response): Promise<void> => {
  try {
    const depots = await prisma.depot.findMany({
      include: {
        jeux: true, // Inclure les jeux associés
        vendeur: true, // Inclure les informations du vendeur
      },
    });

    res.status(200).json(depots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération des dépôts." });
  }
};

// Récupérer un dépôt par ID
export const getDepotById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const depot = await prisma.depot.findUnique({
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération du dépôt." });
  }
};



//On a besoin de que de récupérer tous les depots et voir la liste de tous les depots faites/ou voir le détail d'un dépot particulier 
//On a pas besoin de supprimer ni de update un depot,puisque ça fait partie de l'historique de notre app 
