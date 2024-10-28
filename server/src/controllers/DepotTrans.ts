import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

    if (!vendeur) {
      vendeur = await prisma.vendeur.create({
        data: {
          Nom: req.body.vendeurNom,
          Email: req.body.vendeurEmail,
          Telephone: req.body.vendeurTelephone,
          
        },
      });
    }

    // Initialiser la commission totale pour le dépôt
    let comissionDepotTotal = 0;

    // Créer un nouveau dépôt sans commission totale pour le moment
    const nouveauDepot = await prisma.depot.create({
      data: {
        VendeurID: vendeur.VendeurID,
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
