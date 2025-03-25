import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class VendeurController {
  // Créer un nouveau vendeur
  static async createVendeur(req: Request, res: Response): Promise<void> {
    const { Nom, Email, Telephone } = req.body;

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

  static async getTopVendeurs(req: Request, res: Response) {
    try {
      // Étape 1 : Agréger les totaux de commissions pour chaque vendeur
      const vendeursAvecTotal = await prisma.depot.groupBy({
        by: ["VendeurID"], // Grouper par ID de vendeur
        _sum: {
          comission_depot_total: true, // Somme des commissions
        },
        orderBy: {
          _sum: {
            comission_depot_total: "desc", // Trier par ordre décroissant
          },
        },
        take: 5, // Limiter aux 5 premiers vendeurs
      });
  
      // Étape 2 : Récupérer les détails des vendeurs correspondants
      const topVendeurs = await prisma.vendeur.findMany({
        where: {
          VendeurID: {
            in: vendeursAvecTotal.map((v) => v.VendeurID),
          },
        },
        include: {
          depots: true, // Inclure les dépôts si nécessaire
        },
      });
  
      // Ajouter les totaux calculés aux vendeurs
      const result = topVendeurs.map((vendeur) => {
        const total = vendeursAvecTotal.find((v) => v.VendeurID === vendeur.VendeurID);
        return {
          ...vendeur,
          totalCommissions: total?._sum.comission_depot_total || 0,
        };
      });
  
      res.status(200).json(result);
    } catch (error) {
      console.error("Erreur lors de la récupération des meilleurs vendeurs : ", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
    }
  }
}
//on a besoin de creer un vendeur,retourner tous les vendeurs,recuperer un vendeur a partir de son ID
//et si on veut update les informations d'un vendeur on peut.
 
