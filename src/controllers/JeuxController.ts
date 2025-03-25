import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";// Assurez-vous que le chemin est correct

const prisma = new PrismaClient();

// Obtenir tous les jeux
export const getAllJeux = async (req: Request, res: Response): Promise<void> => {
  try {
    const jeux = await prisma.jeu.findMany({
      include: {
        depot: true,        // Inclut les informations du dépôt
        jeuxMarque: true,   // Inclut les informations de la marque
      },
    });
    res.status(200).json(jeux);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération des jeux." });
  }
};


export const getAllJeuxEnVente = async (req: Request, res: Response): Promise<void> => {
  try {
    const jeuxEnVente = await prisma.jeu.findMany({
      where: {
        mise_en_vente: true, // Filtre pour les jeux en vente
      },
      include: {
        depot: true,        // Inclut les informations du dépôt
        jeuxMarque: true,   // Inclut les informations de la marque
      },
    });
    res.status(200).json(jeuxEnVente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération des jeux en vente." });
  }
};


//  Obtenir un jeu par ID
export const getJeuById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const jeu = await prisma.jeu.findUnique({
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération du jeu." });
  }
};


// Mettre un jeu en vente (mise à jour de mise_en_vente à true)
export const mettreEnVente = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const updatedJeu = await prisma.jeu.update({
      where: {
        JeuID: parseInt(id, 10),
      },
      data: {
        mise_en_vente: true,
      },
    });

    res.status(200).json(updatedJeu);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la mise en vente du jeu." });
  }
};
// Mettre un jeu en vente (mise à jour de mise_en_vente à true)
export const remettre = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const updatedJeu = await prisma.jeu.update({
      where: {
        JeuID: parseInt(id, 10),
      },
      data: {
        mise_en_vente: false,
      },
    });

    res.status(200).json(updatedJeu);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la mise en vente du jeu." });
  }
};


// Supprimer un jeu
export const deleteJeu = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    await prisma.jeu.delete({
      where: { JeuID: parseInt(id) },
    });
    res.status(204).send(); // Pas de contenu à retourner
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la suppression du jeu." });
  }
};




//Voir la liste des jeux,détail d'un jeu particulier,mettre en vente,ou le supprimer de la base de données sont des trucs 
//qu'on aura besoin de faire 