import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AchatController {
  static createAchat(arg0: string, createAchat: any) {
      throw new Error('Method not implemented.');
  }
 

  // Récupérer tous les achats
  static async getAllAchats(req: Request, res: Response): Promise<void> {
    try {
      const achats = await prisma.achat.findMany({
        include: {
          achat_jeux: true, // Inclure les jeux associés
          session: true,    // Inclure les informations sur la session
            // Inclure les informations sur l'acheteur
        },
      });
      res.status(200).json(achats);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur lors de la récupération des achats.' });
    }
  }

  // Récupérer un achat par son ID
  static async getAchatById(req: Request, res: Response): Promise<void> {
    const { AchatID } = req.params;

    try {
      const achat = await prisma.achat.findUnique({
        where: {
          AchatID: Number(AchatID),
        },
        include: {
          achat_jeux: true,
          session: true,
          
        },
      });
      if (!achat) {
        res.status(404).json({ message: 'Achat non trouvé.' });
        return;
      }
      res.status(200).json(achat);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur lors de la récupération de l\'achat.' });
    }
  }
  


}

//On a besoin de récupérer l'historique des achat,et voir les détails d'un achat particulier!
