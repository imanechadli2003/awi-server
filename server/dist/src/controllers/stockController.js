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
exports.getJeuxMarqueById = exports.getAllJeuxMarques = exports.getVendeurById = exports.getvendeurs = exports.mettreEnVente = exports.creerDepot = exports.getJeux = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
//affichage 
//on a besoin de récuperer la liste des jeux pour l'afficher
const getJeux = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jeux = yield prisma.jeu.findMany({});
        res.json(jeux);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving products" });
    }
});
exports.getJeux = getJeux;
const creerDepot = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { vendeurId, jeux } = req.body;
    // Vérification des données reçues
    if (!vendeurId || !jeux || jeux.length === 0) {
        console.log("Erreur : Vendeur ou jeux manquants");
        res.status(400).json({ error: "Vendeur et jeux sont nécessaires." });
        return;
    }
    try {
        // Vérifier qu'il existe une session active
        const sessionActive = yield prisma.session.findFirst({
            where: { Statut: true },
        });
        if (!sessionActive) {
            console.log("Erreur : Aucune session active trouvée");
            res.status(400).json({ error: "Aucune session active en cours." });
            return;
        }
        console.log("Session active trouvée:", sessionActive);
        // Vérifier si le vendeur existe, sinon créer un nouveau vendeur
        let vendeur = yield prisma.vendeur.findUnique({
            where: { VendeurID: vendeurId },
        });
        if (!vendeur) {
            console.log(`Le vendeur avec ID ${vendeurId} n'existe pas, création d'un nouveau vendeur.`);
        }
        else {
            console.log(`Vendeur trouvé: ${vendeur.VendeurID}`);
        }
        // Initialiser la commission totale pour le dépôt
        let comissionDepotTotal = 0;
        // Créer un nouveau dépôt sans commission totale pour le moment
        const nouveauDepot = yield prisma.depot.create({
            data: {
                VendeurID: vendeur ? vendeur.VendeurID : vendeurId, // Utilisation du vendeur existant ou création d'un nouveau
                date_depot: new Date(),
                id_session: sessionActive.idSession,
                comission_depot_total: 0,
            },
        });
        console.log(`Nouveau dépôt créé avec ID ${nouveauDepot.ID_depot}`);
        // Parcourir chaque jeu à déposer
        for (const jeu of jeux) {
            console.log(`Traitement du jeu: ${jeu.nomJeu} - Quantité: ${jeu.quantite_depose}`);
            // Vérification si un jeu avec le même JeuRef_id existe déjà dans le dépôt
            const jeuExistant = yield prisma.jeu.findFirst({
                where: {
                    depot_ID: nouveauDepot.ID_depot,
                    JeuRef_id: jeu.nomJeu, // Vérification avec le JeuRef_id
                },
            });
            if (jeuExistant) {
                // Si un jeu existe déjà, le supprimer avant de créer un nouveau jeu
                console.log(`Jeu avec JeuRef_id ${jeu.nomJeu} déjà existant, suppression du jeu.`);
                yield prisma.jeu.delete({
                    where: { JeuID: jeuExistant.JeuID },
                });
                console.log(`Jeu ${jeu.nomJeu} supprimé du dépôt ${nouveauDepot.ID_depot}`);
            }
            // Création du nouveau jeu dans le dépôt
            const nouveauJeu = yield prisma.jeu.create({
                data: {
                    JeuRef_id: jeu.nomJeu,
                    depot_ID: nouveauDepot.ID_depot,
                    prix_unitaire: jeu.prixUnitaire,
                    mise_en_vente: false,
                    quantite_disponible: jeu.quantite_depose,
                },
            });
            console.log(`Jeu créé avec succès: ${nouveauJeu.JeuRef_id} - Quantité déposée: ${jeu.quantite_depose}`);
            // Calculer la commission pour ce jeu spécifique
            const commissionJeu = sessionActive.pourc_frais_depot * jeu.prixUnitaire;
            console.log(`Commission pour le jeu ${jeu.nomJeu}: ${commissionJeu}`);
            // Ajouter cette commission au total du dépôt
            comissionDepotTotal += commissionJeu * jeu.quantite_depose;
            console.log(`Commission totale mise à jour: ${comissionDepotTotal}`);
            // Créer l'entrée dans `DepotJeu` pour associer le jeu au dépôt
            yield prisma.depotJeu.create({
                data: {
                    depot_ID: nouveauDepot.ID_depot,
                    JeuID: nouveauJeu.JeuID,
                    quantite_depose: jeu.quantite_depose,
                    comission_depot: commissionJeu,
                },
            });
            console.log(`Jeu ${jeu.nomJeu} associé au dépôt`);
        }
        // Mettre à jour la commission totale du dépôt
        yield prisma.depot.update({
            where: { ID_depot: nouveauDepot.ID_depot },
            data: { comission_depot_total: comissionDepotTotal },
        });
        console.log(`Commission totale du dépôt mise à jour: ${comissionDepotTotal}`);
        // Réponse de succès
        res.status(201).json({
            message: "Dépôt et jeux associés créés avec succès",
            depot: nouveauDepot,
            comission_depot_total: comissionDepotTotal,
        });
    }
    catch (error) {
        console.error("Erreur lors de la création du dépôt et des jeux:", error);
        res.status(500).json({ error: "Erreur lors de la création du dépôt et des jeux" });
    }
});
exports.creerDepot = creerDepot;
//bouton mettre en vente 
//on a besoin de mettre en vente un jeu si jamais on clique sur le bouton
const mettreEnVente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const updatedJeu = yield prisma.jeu.update({
            where: {
                JeuID: parseInt(id, 10),
            },
            data: {
                mise_en_vente: true,
            },
        });
        res.status(200).json(updatedJeu);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la mise en vente du jeu." });
    }
});
exports.mettreEnVente = mettreEnVente;
//liste des vendeurs 
//on a besoin de la liste des vendeurs pour selectionner le vendeur qu'on veut  
// Liste des vendeurs
// on a besoin de la liste des vendeurs pour sélectionner le vendeur qu'on veut
const getvendeurs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Récupérer tous les vendeurs avec leurs dépôts associés
        const vendeurs = yield prisma.vendeur.findMany({
            include: {
                depots: true, // Inclure les dépôts associés au vendeur
            },
        });
        // Retourner les vendeurs en réponse
        res.status(200).json(vendeurs);
    }
    catch (error) {
        // En cas d'erreur, afficher l'erreur dans la console et retourner une réponse d'erreur
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des vendeurs.' });
    }
});
exports.getvendeurs = getvendeurs;
//on a besoin de recuperer le vendeur selectionné
const getVendeurById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Récupérer l'ID du vendeur depuis les paramètres de la requête
    try {
        // Trouver un vendeur unique avec l'ID donné, incluant les dépôts associés
        const vendeur = yield prisma.vendeur.findUnique({
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
    }
    catch (error) {
        // En cas d'erreur, afficher l'erreur et renvoyer une réponse d'erreur 500
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération du vendeur.' });
    }
});
exports.getVendeurById = getVendeurById;
// Obtenir toutes les marques de jeux
const getAllJeuxMarques = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jeuxMarques = yield prisma.jeuxMarque.findMany();
        res.status(200).json(jeuxMarques);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la récupération des marques de jeux." });
    }
});
exports.getAllJeuxMarques = getAllJeuxMarques;
const getJeuxMarqueById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const jeuxMarque = yield prisma.jeuxMarque.findUnique({
            where: { JeuRef_id: parseInt(id) },
        });
        if (!jeuxMarque) {
            res.status(404).json({ error: "Marque de jeu non trouvée." });
            return;
        }
        res.status(200).json(jeuxMarque);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la récupération de la marque de jeu." });
    }
});
exports.getJeuxMarqueById = getJeuxMarqueById;
