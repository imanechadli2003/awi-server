import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const createAchat = async (selectedGames: { JeuID: number; quantite: number }[]) => {
    try {
      // Étape 1 : Vérifier l'existence d'une session active
      const activeSession = await prisma.session.findFirst({
        where: { Statut: true },
      });
  
      if (!activeSession) {
        throw new Error("Aucune session active trouvée.");
      }
  
      // Variables pour le calcul
      let totalComissionVente = 0;
      let totalPaye = 0;
  
      // Dictionnaire pour accumuler les données par vendeur
      const vendeurData: Record<number, { totalVentes: number; totalStocks: number; totalComissions: number; totalGains: number }> = {};
  
      // Étape 2 : Vérification des quantités disponibles et préparation des données pour AchatJeu
      const achatJeux = [];
      for (const { JeuID, quantite } of selectedGames) {
        const jeu = await prisma.jeu.findUnique({
          where: { JeuID },
          include: { 
            depot: { include: { vendeur: true } },
            jeuxMarque: true
          },
        });
  
        if (!jeu) {
          throw new Error(`Jeu avec ID ${JeuID} introuvable.`);
        }
  
        if (jeu.quantite_disponible < quantite) {
          throw new Error(
            `Quantité insuffisante pour le jeu ${JeuID}. Disponible: ${jeu.quantite_disponible}, Requise: ${quantite}.`
          );
        }
  
        // Calculer la commission pour ce jeu
        const comissionVenteJeu =
          quantite * jeu.prix_unitaire * (activeSession.pourc_frais_vente / 100);
  
        // Calculer le gain net pour le vendeur
        const gainNet = quantite * jeu.prix_unitaire - comissionVenteJeu;
  
        // Ajouter les détails à la liste des achats
        achatJeux.push({
          JeuID,
          quantite_achete: quantite,
          comission_vente: comissionVenteJeu,
        });
  
        // Mettre à jour les données du vendeur
        const vendeurID = jeu.depot.VendeurID;
  
        if (!vendeurData[vendeurID]) {
          vendeurData[vendeurID] = { totalVentes: 0, totalStocks: 0, totalComissions: 0, totalGains: 0 };
        }
  
        vendeurData[vendeurID].totalVentes += quantite; // Ajouter les ventes
        vendeurData[vendeurID].totalStocks += jeu.quantite_disponible - quantite; // Mettre à jour les stocks
        vendeurData[vendeurID].totalComissions += comissionVenteJeu; // Ajouter la commission
        vendeurData[vendeurID].totalGains += gainNet; // Ajouter les gains nets
  
        // Mettre à jour les totaux globaux
        totalComissionVente += comissionVenteJeu;
        totalPaye += quantite * jeu.prix_unitaire;
      }
  
      // Étape 3 : Créer l'achat
      const achat = await prisma.achat.create({
        data: {
          Total_paye: totalPaye,
          id_session: activeSession.idSession,
          DateAchat: new Date(),
          comission_vente_total: totalComissionVente,
          achat_jeux: {
            create: achatJeux,
          },
        },
      });
  
      // Étape 4 : Mettre à jour les stocks des jeux
      for (const { JeuID, quantite_achete } of achatJeux) {
        await prisma.jeu.update({
          where: { JeuID },
          data: {
            quantite_disponible: { decrement: quantite_achete },
          },
        });
      }
  
      // Étape 5 : Mettre à jour le bilan des vendeurs
      for (const [vendeurID, { totalVentes, totalStocks, totalComissions, totalGains }] of Object.entries(vendeurData)) {
        await prisma.bilanVendeurSession.upsert({
          where: {
            id_vendeur_id_session: {
              id_vendeur: Number(vendeurID),
              id_session: activeSession.idSession,
            },
          },
          create: {
            id_vendeur: Number(vendeurID),
            id_session: activeSession.idSession,
            total_depots: 0, // Pas de mise à jour des dépôts ici
            total_ventes: totalVentes,
            total_stocks: totalStocks,
            total_comissions: totalComissions,
            total_gains: totalGains,
          },
          update: {
            total_ventes: { increment: totalVentes },
            total_stocks: { set: totalStocks },
            total_comissions: { increment: totalComissions },
            total_gains: { increment: totalGains },
          },
        });
      }
  
      return achat;
    } catch (error) {
      console.error("Erreur lors de la création de l'achat :", error);
      throw error;
    }
  };
// Route pour créer un achat

  


