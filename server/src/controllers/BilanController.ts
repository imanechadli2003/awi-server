import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const obtenirBilanVendeurSession = async (req: Request, res: Response): Promise<void> => {
  const { vendeurId, sessionId } = req.params;

  if (!vendeurId || !sessionId) {
    res.status(400).json({ error: "vendeurId et sessionId sont requis." });
    return;
  }

  try {
    // Vérification de l'existence du vendeur
    const vendeur = await prisma.vendeur.findUnique({
      where: { VendeurID: parseInt(vendeurId) },
    });

    if (!vendeur) {
      res.status(404).json({ error: "Vendeur non trouvé." });
      return;
    }

    // Vérification de l'existence de la session
    const session = await prisma.session.findUnique({
      where: { idSession: parseInt(sessionId) },
    });

    if (!session) {
      res.status(404).json({ error: "Session non trouvée." });
      return;
    }

    // Récupération du bilan
    const bilan = await prisma.bilanVendeurSession.findUnique({
      where: {
        id_vendeur_id_session: {
          id_vendeur: parseInt(vendeurId),
          id_session: parseInt(sessionId),
        },
      },
    });

    if (!bilan) {
      res.status(404).json({
        error: "Aucun bilan trouvé pour ce vendeur et cette session.",
      });
      return;
    }

    res.status(200).json({
      BilanVendeurSession: {
        total_depots: bilan.total_depots,
        total_ventes: bilan.total_ventes,
        total_stocks: bilan.total_stocks,
        total_gains: bilan.total_gains,
        total_comissions: bilan.total_comissions,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du bilan:", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};
