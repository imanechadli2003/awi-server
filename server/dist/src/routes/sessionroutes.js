"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SessionController_1 = require("../controllers/SessionController");
const BilanController_1 = require("../controllers/BilanController");
const UsersController_1 = require("../controllers/UsersController");
const asyncHandler_1 = require("./asyncHandler");
const router = (0, express_1.Router)();
// Route pour créer une session
router.post("/", SessionController_1.createSession);
router.get("/", SessionController_1.getAllSessions);
// Route pour fermer une session
router.patch("/close", SessionController_1.closeSession);
// Route pour récupérer la session active
router.get("/active", SessionController_1.getActiveSession);
router.get('/bilan/:vendeurId/:sessionId', BilanController_1.obtenirBilanVendeurSession);
router.get("/managers", (0, asyncHandler_1.asyncHandler)(UsersController_1.getAllManagers));
router.post("/managers", (0, asyncHandler_1.asyncHandler)(UsersController_1.createManager));
exports.default = router;
