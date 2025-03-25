import { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();  // Ensure you're importing Prisma Client correctly


// 2. Mettre un jeu en vente
const mettreEnVente = async (req: Request, res: Response): Promise<Response> => {
  const { jeuID, sessionID } = req.body;

  try {
    // Vérifier si la session existe
    const sessionExist = await prisma.session.findUnique({
      where: { idSession: sessionID },
      include: { depots: { include: { jeux: true } } },
    });

    if (!sessionExist) {
      return res.status(404).json({ message: 'Session non trouvée.' });
    }

    // Trouver le jeu dans la session
    const jeuExist = sessionExist.depots.flatMap(depot => depot.jeux).find(jeu => jeu.JeuID === jeuID);

    if (!jeuExist) {
      return res.status(404).json({ message: 'Jeu non trouvé dans cette session.' });
    }

    // Marquer le jeu comme "en vente"
    const jeuMisEnVente = await prisma.jeu.update({
      where: { JeuID: jeuID },
      data: { mise_en_vente: true },  // Marquer le jeu comme en vente
    });

    return res.status(200).json({
      message: 'Jeu mis en vente avec succès.',
      jeu: jeuMisEnVente,
    });
  } catch (error) {
    console.error("Erreur lors de la mise en vente du jeu:", error);
    return res.status(500).json({ message: "Erreur interne du serveur." });
  }
};

// 3. Récupérer les jeux d'un dépôt
const getJeux = async (req: Request, res: Response): Promise<Response> => {
  const { sessionID } = req.params;

  try {
    // Récupérer la session et ses jeux
    const session = await prisma.session.findUnique({
      where: { idSession: parseInt(sessionID) },
      include: { depots: { include: { jeux: true } } },
    });

    if (!session) {
      return res.status(404).json({ message: 'Session non trouvée.' });
    }

    const jeux = session.depots.flatMap(depot => depot.jeux);
    return res.status(200).json(jeux);
  } catch (error) {
    console.error("Erreur lors de la récupération des jeux:", error);
    return res.status(500).json({ message: "Erreur interne du serveur." });
  }
};

// 4. Récupérer tous les vendeurs
const getVendeurs = async (req: Request, res: Response): Promise<Response> => {
  try {
    const vendeurs = await prisma.vendeur.findMany();
    return res.status(200).json(vendeurs);
  } catch (error) {
    console.error("Erreur lors de la récupération des vendeurs:", error);
    return res.status(500).json({ message: "Erreur interne du serveur." });
  }
};

export {
  mettreEnVente,
  getJeux,
  getVendeurs,
};

