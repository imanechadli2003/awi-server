import express from "express";
import { getJeux,creerDepot, mettreEnVente,getvendeurs,getVendeurById,getAllJeuxMarques,getJeuxMarqueById} from "../controllers/stockController"; 
import { getDepots } from "../controllers/DepotsController";
import { getAllJeuxEnVente, remettre } from "../controllers/JeuxController";
import { createAchat } from "../controllers/AchatTrans";
const router = express.Router();

router.get('/jeux', getJeux);
router.post('/depot', creerDepot);

router.get('/jeuxenvente', getAllJeuxEnVente);

router.get('/depots',getDepots)
router.patch('/jeux/:id/mettre-en-vente', mettreEnVente);
router.patch('/jeux/:id/remettre', remettre);
router.get('/vendeurs', getvendeurs);
router.get('/vendeurs/:id', getVendeurById);
router.get('/marques', getAllJeuxMarques);
router.get('/marques/:id', getJeuxMarqueById);

export default router;


