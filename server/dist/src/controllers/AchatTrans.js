"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// Contrôleur pour créer un achat
const AchatController = {
    // Méthode pour créer un achat
    createAchat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { jeuxAchat } = req.body; // Supposons que ce soit un tableau d'objets avec JeuID et quantite_achete
            // Vérifier s'il y a une session active
            const sessionActive = yield prisma.session.findFirst({
                where: { Statut: true }, // Statut pour vérifier si la session est active
            });
            if (!sessionActive) {
                return res.status(400).json({ message: "Aucune session active." });
            }
            // Vérifier la quantité disponible pour chaque jeu
            let totalComissionVente = 0;
            for (const achatJeu of jeuxAchat) {
                const jeu = yield prisma.jeu.findUnique({
                    where: { JeuID: achatJeu.JeuID },
                });
                if (!jeu) {
                    return res.status(404).json({ message: `Jeu avec ID ${achatJeu.JeuID} non trouvé.` });
                }
                if (achatJeu.quantite_achete > jeu.quantite_disponible) {
                    return res.status(400).json({ message: `Quantité achetée pour le jeu ${jeu.JeuID} dépasse la quantité disponible.` });
                }
                // Calculer la commission pour ce jeu ce qu'on veut 
                const comissionVente = (jeu.prix_unitaire) * (sessionActive.pourc_frais_vente / 100);
                totalComissionVente += comissionVente * achatJeu.quantite_achete;
                // Mettre à jour la quantité disponible du jeu
                yield prisma.jeu.update({
                    where: { JeuID: jeu.JeuID },
                    data: {
                        quantite_disponible: jeu.quantite_disponible - achatJeu.quantite_achete,
                    },
                });
            }
            // Calculer le total payé
            const totalPaye = jeuxAchat.reduce((total, achatJeu) => __awaiter(this, void 0, void 0, function* () {
                const jeu = yield prisma.jeu.findUnique({
                    where: { JeuID: achatJeu.JeuID },
                });
                return total + (jeu.prix_unitaire * achatJeu.quantite_achete);
            }), 0);
            // Créer l'enregistrement d'achat
            const achat = yield prisma.achat.create({
                data: {
                    Total_paye: totalPaye,
                    id_session: sessionActive.idSession,
                    DateAchat: new Date(),
                    comission_vente_total: totalComissionVente,
                    achat_jeux: {
                        create: jeuxAchat.map((achatJeu) => __awaiter(this, void 0, void 0, function* () {
                            return ({
                                JeuID: achatJeu.JeuID,
                                quantite_achete: achatJeu.quantite_achete,
                                comission_vente: (yield prisma.jeu.findUnique({ where: { JeuID: achatJeu.JeuID } })).prix_unitaire * (sessionActive.pourc_frais_vente / 100) * achatJeu.quantite_achete,
                            });
                        })),
                    },
                },
            });
            return res.status(201).json({ message: "Achat créé avec succès.", achat });
        });
    },
};
module.exports = AchatController;
