import { Router } from "express";
import { createSession, closeSession, getActiveSession ,getAllSessions} from "../controllers/SessionController"
import { obtenirBilanVendeurSession } from '../controllers/BilanController';
import { getAllManagers, createManager } from '../controllers/UsersController'
import { asyncHandler } from "./asyncHandler";
const router = Router();

// Route pour créer une session
router.post("/", createSession);
router.get("/",getAllSessions)

// Route pour fermer une session
router.patch("/close", closeSession);

// Route pour récupérer la session active
router.get("/active", getActiveSession);

router.get('/bilan/:vendeurId/:sessionId',obtenirBilanVendeurSession); 

router.get("/managers", asyncHandler(getAllManagers));
router.post("/managers", asyncHandler(createManager));
export default router;
