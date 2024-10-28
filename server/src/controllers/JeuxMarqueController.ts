import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import fs from "fs";
import csv from "csv-parser";

const prisma = new PrismaClient();

//  Créer une nouvelle marque de jeu
export const createJeuxMarque = async (req: Request, res: Response): Promise<void> => {
  const { JeuRef_id, Nom, Editeur,Description} = req.body;

  try {
    const newJeuxMarque = await prisma.jeuxMarque.create({
      data: {
        JeuRef_id, 
        Nom,
        Editeur,
        Description,
      },
    });
    res.status(201).json(newJeuxMarque);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la création de la marque de jeu." });
  }
};

// Obtenir toutes les marques de jeux
export const getAllJeuxMarques = async (req: Request, res: Response): Promise<void> => {
  try {
    const jeuxMarques = await prisma.jeuxMarque.findMany();
    res.status(200).json(jeuxMarques);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération des marques de jeux." });
  }
};

// Obtenir une marque de jeu par ID
export const getJeuxMarqueById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const jeuxMarque = await prisma.jeuxMarque.findUnique({
        where: { JeuRef_id: parseInt(id) },
      });
      if (!jeuxMarque) {
       
        res.status(404).json({ error: "Marque de jeu non trouvée." });
        return; 
      }
      res.status(200).json(jeuxMarque);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur lors de la récupération de la marque de jeu." });
    }
  };

/* Supprimer une marque de jeu*/
export const deleteJeuxMarque = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    await prisma.jeuxMarque.delete({
      where: { JeuRef_id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la suppression de la marque de jeu." });
  }
};

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

