import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient(); 

// Contrôleur pour créer une session
export const createSession = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Vérifier s'il y a une session active
    const activeSession = await prisma.session.findFirst({
      where: {
        Statut: true, // Vérifie si une session est active
      },
    });

    if (activeSession) {
      return res.status(400).json({ error: "Une session est déjà active." });
    }

    const { NomSession, pourc_frais_depot, pourc_frais_vente } = req.body;

    const newSession = await prisma.session.create({
      data: {
        NomSession,
        DateDebut: new Date(),
        pourc_frais_depot,
        pourc_frais_vente,
        Statut: true, // Marque la session comme active
      },
    });

    return res.status(201).json(newSession); // Change void to Response
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erreur lors de la création de la session." }); // Change void to Response
  }
};

// Contrôleur pour fermer une session
export const closeSession = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Vérifier s'il y a une session active
    const activeSession = await prisma.session.findFirst({
      where: {
        Statut: true, // Vérifie si une session est active
      },
    });

    if (!activeSession) {
      return res.status(400).json({ error: "Aucune session active à fermer." });
    }

    // Mettre à jour la session active pour la fermer
    const closedSession = await prisma.session.update({
      where: {
        idSession: activeSession.idSession,
      },
      data: {
        Statut: false, // Change le statut à false
        DateFin: new Date(), // Enregistre la date de fin
      },
    });

    return res.status(200).json(closedSession); // Change void to Response
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erreur lors de la fermeture de la session." }); // Change void to Response
  }
};


