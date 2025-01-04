import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
//affichage 
//on a besoin de récuperer la liste des jeux pour l'afficher
export const getJeux = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const jeux = await prisma.jeu.findMany({
    });
    res.json(jeux);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving products" });
  }
};
//bouton creer un depot
//on a besoin de creer un depot
//on a besoin de la liste des jeux avec le vendeur 
export const creerDepot = async (req: Request, res: Response): Promise<void> => {
    const { vendeurId, jeux } = req.body;
  
    try {
      // Vérifier qu'il existe une session active
      const sessionActive = await prisma.session.findFirst({
        where: { Statut: true },
      });
  
      if (!sessionActive) {
        res.status(400).json({ error: "Aucune session active en cours." });
        return;
      }
  
      // Vérifier si le vendeur existe, sinon créer un nouveau vendeur
      let vendeur = await prisma.vendeur.findUnique({
        where: { VendeurID: vendeurId },
      });
  
      
      // Initialiser la commission totale pour le dépôt
      let comissionDepotTotal = 0;
  
      // Créer un nouveau dépôt sans commission totale pour le moment
      const nouveauDepot = await prisma.depot.create({
        data: {
          VendeurID: vendeur!.VendeurID,
          date_depot: new Date(),
          id_session: sessionActive.idSession,
          comission_depot_total: 0,
        },
      });
  
      // Parcourir chaque jeu à déposer
      for (const jeu of jeux) {
        const nouveauJeu = await prisma.jeu.create({
          data: {
            JeuRef_id: jeu.nomJeu, 
            depot_ID: nouveauDepot.ID_depot,
            prix_unitaire: jeu.prixUnitaire,
            mise_en_vente: false,
            quantite_disponible:jeu.quantite_depose,
             
          },
        });
  
        // Calculer la commission pour ce jeu spécifique
        const commissionJeu = sessionActive.pourc_frais_depot * jeu.prixUnitaire ;
  
        // Ajouter cette commission au total du dépôt
        comissionDepotTotal += commissionJeu* jeu.quantiteDepose;
  
        // Créer l'entrée dans `DepotJeu` pour associer le jeu au dépôt
        await prisma.depotJeu.create({
          data: {
            depot_ID: nouveauDepot.ID_depot,
            JeuID: nouveauJeu.JeuID,
            quantite_depose: jeu.quantiteDepose,
            comission_depot: commissionJeu,
          },
        });
      }
  
      // Mettre à jour le dépôt avec la commission totale calculée
      await prisma.depot.update({
        where: { ID_depot: nouveauDepot.ID_depot },
        data: { comission_depot_total: comissionDepotTotal },
      });
  
      // Retourner la réponse avec les détails du dépôt
      res.status(201).json({
        message: "Dépôt et jeux associés créés avec succès",
        depot: nouveauDepot,
        comission_depot_total: comissionDepotTotal,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur lors de la création du dépôt et des jeux" });
    }
  };
//bouton mettre en vente 
//on a besoin de mettre en vente un jeu si jamais on clique sur le bouton
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
//liste des vendeurs 
 //on a besoin de la liste des vendeurs pour selectionner le vendeur qu'on veut  
// Liste des vendeurs
// on a besoin de la liste des vendeurs pour sélectionner le vendeur qu'on veut
export const getvendeurs = async (req: Request, res: Response): Promise<void> => {
    try {
      // Récupérer tous les vendeurs avec leurs dépôts associés
      const vendeurs = await prisma.vendeur.findMany({
        include: {
          depots: true,  // Inclure les dépôts associés au vendeur
        },
      });
  
      // Retourner les vendeurs en réponse
      res.status(200).json(vendeurs);
    } catch (error) {
      // En cas d'erreur, afficher l'erreur dans la console et retourner une réponse d'erreur
      console.error(error);
      res.status(500).json({ message: 'Erreur lors de la récupération des vendeurs.' });
    }
  };
  
//on a besoin de recuperer le vendeur selectionné
export const getVendeurById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params; // Récupérer l'ID du vendeur depuis les paramètres de la requête
  
    try {
      // Trouver un vendeur unique avec l'ID donné, incluant les dépôts associés
      const vendeur = await prisma.vendeur.findUnique({
        where: { VendeurID: Number(id) }, // Chercher par l'ID du vendeur
        include: {
          depots: true, // Inclure les dépôts associés
        },
      });
  
      // Si le vendeur n'est pas trouvé, renvoyer une erreur 404
      if (!vendeur) {
        res.status(404).json({ message: 'Vendeur non trouvé.' });
        return;
      }
  
      // Si le vendeur est trouvé, renvoyer les données avec un statut 200
      res.status(200).json(vendeur);
    } catch (error) {
      // En cas d'erreur, afficher l'erreur et renvoyer une réponse d'erreur 500
      console.error(error);
      res.status(500).json({ message: 'Erreur lors de la récupération du vendeur.' });
    }
  };

  // Obtenir toutes les marques de jeux
export const getAllJeuxMarques = async (req: Request, res: Response): Promise<void> => {
    try {
      const jeuxMarques = await prisma.jeuxMarque.findMany();
      res.status(200).json(jeuxMarques);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur lors de la récupération des marques de jeux." });
    }
  };
export const getJeuxMarqueById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const jeuxMarque = await prisma.jeuxMarque.findUnique({
        where: { JeuRef_id: parseInt(id) },
      });
      if (!jeuxMarque) {
       
        res.status(404).json({ error: "Marque de jeu non trouvée." });
        return; 
      }
      res.status(200).json(jeuxMarque);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur lors de la récupération de la marque de jeu." });
    }
  };