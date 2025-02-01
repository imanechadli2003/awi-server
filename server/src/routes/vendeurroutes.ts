import { Router } from 'express';
import { VendeurController } from '../controllers/VendeurController';
import { BilanVendeurSession } from '@prisma/client';
const router = Router();

// Créer un vendeur
router.post('/', VendeurController.createVendeur);

// Récupérer tous les vendeurs
router.get('/', VendeurController.getAllVendeurs);

// Récupérer un vendeur par ID
router.get('/:id', VendeurController.getVendeurById);

// Mettre à jour un vendeur par ID
router.put('/:id', VendeurController.updateVendeur);

// Récupérer les top vendeurs
router.get('/top', VendeurController.getTopVendeurs);

export default router;
