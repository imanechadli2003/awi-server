import { Router } from 'express';
import { createAchat } from '../controllers/AchatTrans';

const router = Router();

router.post('/achat', async (req, res, next) => {
  try {
    // Extract selectedGames from the request body
    const selectedGames = req.body.selectedGames;

    // Call the createAchat function with selectedGames
    const achat = await createAchat(selectedGames);

    // Return a response with the created achat
    res.status(201).json(achat);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Erreur lors de la création de l'achat :", error);
    res.status(500).json({ error: "Erreur lors de la création de l'achat" });
  }
});

export default router;
