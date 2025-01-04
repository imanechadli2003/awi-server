"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const stockController_1 = require("../controllers/stockController");
const router = express_1.default.Router();
router.get('/jeux', stockController_1.getJeux);
// Route pour mettre un jeu en vente
router.put('/jeux/:id/mettre-en-vente', stockController_1.mettreEnVente);
// Route pour créer un dépôt (vérification de session active et ajout de jeux)
router.post('/depot', stockController_1.creerDepot);
// Route pour récupérer la liste des vendeurs
router.get('/vendeurs', stockController_1.getvendeurs);
// Route pour récupérer un vendeur spécifique avec ses dépôts associés
router.get('/vendeurs/:id', stockController_1.getVendeurById);
// Route pour récupérer toutes les marques de jeux
router.get('/marques', stockController_1.getAllJeuxMarques);
// Route pour récupérer une marque de jeu spécifique
router.get('/marques/:id', stockController_1.getJeuxMarqueById);
exports.default = router;
