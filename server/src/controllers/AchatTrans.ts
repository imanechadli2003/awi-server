import { Request, Response } from 'express';
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Contrôleur pour créer un achat
const AchatController = {
    // Méthode pour créer un achat
    async createAchat(req:Request, res:Response) {
        const { jeuxAchat } = req.body; // Supposons que ce soit un tableau d'objets avec JeuID et quantite_achete

        // Vérifier s'il y a une session active
        const sessionActive = await prisma.session.findFirst({
            where: { Statut: true }, // Statut pour vérifier si la session est active
        });

        if (!sessionActive) {
            return res.status(400).json({ message: "Aucune session active." });
        }

        // Vérifier la quantité disponible pour chaque jeu
        let totalComissionVente = 0;
        for (const achatJeu of jeuxAchat) {
            const jeu = await prisma.jeu.findUnique({
                where: { JeuID: achatJeu.JeuID },
            });

            if (!jeu) {
                return res.status(404).json({ message: `Jeu avec ID ${achatJeu.JeuID} non trouvé.` });
            }

            if (achatJeu.quantite_achete > jeu.quantite_disponible) {
                return res.status(400).json({ message: `Quantité achetée pour le jeu ${jeu.JeuID} dépasse la quantité disponible.` });
            }

            // Calculer la commission pour ce jeu ce qu'on veut 
            const comissionVente = (jeu.prix_unitaire ) * (sessionActive.pourc_frais_vente / 100);
            totalComissionVente += comissionVente* achatJeu.quantite_achete;

            // Mettre à jour la quantité disponible du jeu
            await prisma.jeu.update({
                where: { JeuID: jeu.JeuID },
                data: {
                    quantite_disponible: jeu.quantite_disponible - achatJeu.quantite_achete,
                },
            });
        }

        // Calculer le total payé
        const totalPaye = jeuxAchat.reduce(async (total: number, achatJeu: { JeuID: any; quantite_achete: number; }) => {
            const jeu = await prisma.jeu.findUnique({
                where: { JeuID: achatJeu.JeuID },
            });
            return total + (jeu.prix_unitaire * achatJeu.quantite_achete);
        }, 0);

        // Créer l'enregistrement d'achat
        const achat = await prisma.achat.create({
            data: {
                Total_paye: totalPaye,
                id_session: sessionActive.idSession,
                DateAchat: new Date(),
                comission_vente_total: totalComissionVente,
                achat_jeux: {
                    create: jeuxAchat.map(async (achatJeu: { JeuID: any; quantite_achete: number; }) => ({
                        JeuID: achatJeu.JeuID,
                        quantite_achete: achatJeu.quantite_achete,
                        comission_vente: (await prisma.jeu.findUnique({ where: { JeuID: achatJeu.JeuID } })).prix_unitaire * (sessionActive.pourc_frais_vente / 100) * achatJeu.quantite_achete,
                    })),
                },
            },
        });

        return res.status(201).json({ message: "Achat créé avec succès.", achat });
    },
};

module.exports = AchatController;