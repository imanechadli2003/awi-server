"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const VendeurController_1 = require("../controllers/VendeurController");
const router = (0, express_1.Router)();
// Créer un vendeur
router.post('/', VendeurController_1.VendeurController.createVendeur);
// Récupérer tous les vendeurs
router.get('/', VendeurController_1.VendeurController.getAllVendeurs);
// Récupérer un vendeur par ID
router.get('/:id', VendeurController_1.VendeurController.getVendeurById);
// Mettre à jour un vendeur par ID
router.put('/:id', VendeurController_1.VendeurController.updateVendeur);
// Récupérer les top vendeurs
router.get('/top', VendeurController_1.VendeurController.getTopVendeurs);
exports.default = router;
