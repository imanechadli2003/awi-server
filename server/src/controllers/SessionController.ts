import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

// Contrôleur pour créer une session
export const createSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Vérifier s'il y a une session active
    const activeSession = await prisma.session.findFirst({
      where: { Statut: true },
    });

    if (activeSession) {
      res.status(400).json({ error: "Une session est déjà active." });
      return;
    }

    const { NomSession, pourc_frais_depot, pourc_frais_vente } = req.body;

    const newSession = await prisma.session.create({
      data: {
        NomSession,
        DateDebut: new Date(),
        pourc_frais_depot,
        pourc_frais_vente,
        Statut: true,
      },
    });

    res.status(201).json(newSession);
  } catch (error) {
    console.error("Erreur lors de la création de la session :", error);
    next(error); // Passer l'erreur au middleware de gestion des erreurs
  }
};

// Contrôleur pour fermer une session
export const closeSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const activeSession = await prisma.session.findFirst({
      where: { Statut: true },
    });

    if (!activeSession) {
      res.status(400).json({ error: "Aucune session active à fermer." });
      return;
    }

    const closedSession = await prisma.session.update({
      where: { idSession: activeSession.idSession },
      data: {
        Statut: false,
        DateFin: new Date(),
      },
    });

    res.status(200).json(closedSession);
  } catch (error) {
    console.error("Erreur lors de la fermeture de la session :", error);
    next(error);
  }
};

// Contrôleur pour récupérer la session active
export const getActiveSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const activeSession = await prisma.session.findFirst({
      where: { Statut: true },
    });

    if (!activeSession) {
      res.status(404).json({ error: "Aucune session active." });
      return;
    }

    res.status(200).json(activeSession);
  } catch (error) {
    console.error("Erreur lors de la récupération de la session active :", error);
    next(error);
  }
};
export const getAllSessions = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
  try {
    const sessions = await prisma.session.findMany({
      orderBy: { DateDebut: "desc" }, // Trier par date de début décroissante
    });

    res.status(200).json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des sessions." });
  }
};

