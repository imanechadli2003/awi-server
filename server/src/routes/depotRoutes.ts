import express from "express";
import { getJeux,creerDepot, mettreEnVente,getvendeurs,getVendeurById,getAllJeuxMarques,getJeuxMarqueById} from "../controllers/stockController"; 
import { getDepots } from "../controllers/DepotsController";
const router = express.Router();


router.get('/jeux', getJeux);
router.post('/depot', creerDepot);

router.get('/depots',getDepots)
router.put('/jeux/:id/mettre-en-vente', mettreEnVente);
router.get('/vendeurs', getvendeurs);
router.get('/vendeurs/:id', getVendeurById);
router.get('/marques', getAllJeuxMarques);
router.get('/marques/:id', getJeuxMarqueById);

export default router;


