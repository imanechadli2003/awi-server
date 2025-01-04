"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const stockController_1 = require("../controllers/stockController");
const DepotsController_1 = require("../controllers/DepotsController");
const router = express_1.default.Router();
router.get('/jeux', stockController_1.getJeux);
router.post('/depot', stockController_1.creerDepot);
router.get('/depots', DepotsController_1.getDepots);
router.put('/jeux/:id/mettre-en-vente', stockController_1.mettreEnVente);
router.get('/vendeurs', stockController_1.getvendeurs);
router.get('/vendeurs/:id', stockController_1.getVendeurById);
router.get('/marques', stockController_1.getAllJeuxMarques);
router.get('/marques/:id', stockController_1.getJeuxMarqueById);
exports.default = router;
