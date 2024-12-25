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
exports.deleteJeuxMarque = exports.getJeuxMarqueById = exports.getAllJeuxMarques = exports.createJeuxMarque = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
//  Créer une nouvelle marque de jeu
const createJeuxMarque = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { JeuRef_id, Nom, Editeur, Description } = req.body;
    try {
        const newJeuxMarque = yield prisma.jeuxMarque.create({
            data: {
                JeuRef_id,
                Nom,
                Editeur,
                Description,
            },
        });
        res.status(201).json(newJeuxMarque);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la création de la marque de jeu." });
    }
});
exports.createJeuxMarque = createJeuxMarque;
// Obtenir toutes les marques de jeux
const getAllJeuxMarques = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jeuxMarques = yield prisma.jeuxMarque.findMany();
        res.status(200).json(jeuxMarques);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la récupération des marques de jeux." });
    }
});
exports.getAllJeuxMarques = getAllJeuxMarques;
// Obtenir une marque de jeu par ID
const getJeuxMarqueById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const jeuxMarque = yield prisma.jeuxMarque.findUnique({
            where: { JeuRef_id: parseInt(id) },
        });
        if (!jeuxMarque) {
            res.status(404).json({ error: "Marque de jeu non trouvée." });
            return;
        }
        res.status(200).json(jeuxMarque);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la récupération de la marque de jeu." });
    }
});
exports.getJeuxMarqueById = getJeuxMarqueById;
/* Supprimer une marque de jeu*/
const deleteJeuxMarque = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.jeuxMarque.delete({
            where: { JeuRef_id: parseInt(id) },
        });
        res.status(204).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la suppression de la marque de jeu." });
    }
});
exports.deleteJeuxMarque = deleteJeuxMarque;
/* -------A AJOUTER QUAND IL Y A UN FILE  CSV  DES JEUX -------*/
/* export const importJeuxMarquesFromCSV = async (req: Request, res: Response): Promise<void> => {
  const filePath = req.file?.path;
  if (!filePath) {
    res.status(400).json({ error: "Fichier CSV manquant." });
    return;
  }

  const jeuxMarques: { JeuRef_id: number; Nom: string; Editeur: string }[] = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      jeuxMarques.push({
        JeuRef_id: parseInt(row.JeuRef_id), // Assurez-vous que ce champ est présent et correctement typé
        Nom: row.Nom,
        Editeur: row.Editeur,
      });
    })
    .on("end", async () => {
      try {
        await prisma.jeuxMarque.createMany({
          data: jeuxMarques,
          skipDuplicates: true,
        });
        res.status(200).json({ message: "Importation réussie des marques de jeux depuis le CSV." });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de l'importation du fichier CSV." });
      }
    });
};

*/
