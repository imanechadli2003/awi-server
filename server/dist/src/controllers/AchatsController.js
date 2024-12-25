"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AchatController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class AchatController {
    // Récupérer tous les achats
    static getAllAchats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const achats = yield prisma.achat.findMany({
                    include: {
                        achat_jeux: true, // Inclure les jeux associés
                        session: true, // Inclure les informations sur la session
                        // Inclure les informations sur l'acheteur
                    },
                });
                res.status(200).json(achats);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Erreur lors de la récupération des achats.' });
            }
        });
    }
    // Récupérer un achat par son ID
    static getAchatById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { AchatID } = req.params;
            try {
                const achat = yield prisma.achat.findUnique({
                    where: {
                        AchatID: Number(AchatID),
                    },
                    include: {
                        achat_jeux: true,
                        session: true,
                    },
                });
                if (!achat) {
                    res.status(404).json({ message: 'Achat non trouvé.' });
                    return;
                }
                res.status(200).json(achat);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Erreur lors de la récupération de l\'achat.' });
            }
        });
    }
}
exports.AchatController = AchatController;
//On a besoin de récupérer l'historique des achat,et voir les détails d'un achat particulier!
