import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 1. Récupérer tous les utilisateurs
export const getAllUtilisateurs = async (req: Request, res: Response): Promise<Response> => {
  try {
    const utilisateurs = await prisma.utilisateur.findMany();
    return res.status(200).json(utilisateurs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs." });
  }
};

// 2. Créer un utilisateur (rôle à spécifier dans le corps de la requête)
export const createUtilisateur = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { Nom, Prenom, Email, MdP, Role } = req.body;

    // Vérifier que l'utilisateur n'existe pas déjà
    const existingUser = await prisma.utilisateur.findUnique({
      where: { Email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "L'utilisateur avec cet email existe déjà." });
    }

    const newUser = await prisma.utilisateur.create({
      data: {
        Nom,
        Prenom,
        Email,
        MdP,
        Role,
      },
    });

    return res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erreur lors de l'ajout de l'utilisateur." });
  }
};

// 3. Mettre à jour un utilisateur
export const updateUtilisateur = async (req: Request, res: Response): Promise<Response> => {
  const { UtilisateurID } = req.params; // Assurez-vous d'avoir ce paramètre dans l'URL
  try {
    const { Nom, Prenom, Email, MdP, Role } = req.body;

    const updatedUser = await prisma.utilisateur.update({
      where: { UtilisateurID: parseInt(UtilisateurID) },
      data: {
        Nom,
        Prenom,
        Email,
        MdP,
        Role,
      },
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erreur lors de la mise à jour de l'utilisateur." });
  }
};

// 4. Supprimer un utilisateur
export const deleteUtilisateur = async (req: Request, res: Response): Promise<Response> => {
  const { UtilisateurID } = req.params;
  try {
    await prisma.utilisateur.delete({
      where: { UtilisateurID: parseInt(UtilisateurID) },
    });

    return res.status(204).send(); // No content
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erreur lors de la suppression de l'utilisateur." });
  }
};

// 5. Récupérer tous les utilisateurs ayant le rôle "Manager"
export const getAllManagers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const managers = await prisma.utilisateur.findMany({
      where: { Role: 'Manager' },
    });
    return res.status(200).json(managers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erreur lors de la récupération des managers." });
  }
};

// 6. Créer un utilisateur avec le rôle "Manager"
//    Le rôle est fixé à "Manager" quelle que soit la valeur passée dans le corps de la requête.
export const createManager = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { Nom, Prenom, Email, MdP } = req.body;

    // Vérifier qu'un utilisateur avec cet email n'existe pas déjà
    const existingUser = await prisma.utilisateur.findUnique({
      where: { Email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Un utilisateur avec cet email existe déjà." });
    }

    const newManager = await prisma.utilisateur.create({
      data: {
        Nom,
        Prenom,
        Email,
        MdP,
        Role: 'Manager',  // On fixe le rôle Manager
      },
    });

    return res.status(201).json(newManager);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erreur lors de la création du manager." });
  }
};
