import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class VendeurController {
  // Créer un nouveau vendeur
  static async createVendeur(req: Request, res: Response): Promise<void> {
    const { Nom, Email, Telephone, Balance } = req.body;

    try {
      const newVendeur = await prisma.vendeur.create({
        data: {
          Nom,
          Email,
          Telephone,
          
        },
      });
      res.status(201).json(newVendeur);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur lors de la création du vendeur.' });
    }
  }

  // Récupérer tous les vendeurs
  static async getAllVendeurs(req: Request, res: Response): Promise<void> {
    try {
      const vendeurs = await prisma.vendeur.findMany({
        include: {
          depots: true,  // Inclure les dépôts associés
        },
      });
      res.status(200).json(vendeurs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur lors de la récupération des vendeurs.' });
    }
  }

  // Récupérer un vendeur par ID
  static async getVendeurById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const vendeur = await prisma.vendeur.findUnique({
        where: { VendeurID: Number(id) },
        include: {
          depots: true,  // Inclure les dépôts associés
        },
      });
      if (!vendeur) {
        res.status(404).json({ message: 'Vendeur non trouvé.' });
        return;
      }
      res.status(200).json(vendeur);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur lors de la récupération du vendeur.' });
    }
  }

  // Mettre à jour un vendeur par ID
  static async updateVendeur(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { Nom, Email, Telephone, Balance } = req.body;

    try {
      const updatedVendeur = await prisma.vendeur.update({
        where: { VendeurID: Number(id) },
        data: {
          Nom,
          Email,
          Telephone,
          
        },
      });
      res.status(200).json(updatedVendeur);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour du vendeur.' });
    }
  }

  
}
