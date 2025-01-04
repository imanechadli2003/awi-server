import express from "express";
import { getJeux,creerDepot, mettreEnVente,getvendeurs,getVendeurById,getAllJeuxMarques,getJeuxMarqueById} from "../controllers/stockController"; 
const router = express.Router();


router.get('/jeux', getJeux);

// Route pour mettre un jeu en vente
router.put('/jeux/:id/mettre-en-vente', mettreEnVente);

// Route pour créer un dépôt (vérification de session active et ajout de jeux)
router.post('/depot', creerDepot);

// Route pour récupérer la liste des vendeurs
router.get('/vendeurs', getvendeurs);

// Route pour récupérer un vendeur spécifique avec ses dépôts associés
router.get('/vendeurs/:id', getVendeurById);

// Route pour récupérer toutes les marques de jeux
router.get('/marques', getAllJeuxMarques);

// Route pour récupérer une marque de jeu spécifique
router.get('/marques/:id', getJeuxMarqueById);

export default router;


