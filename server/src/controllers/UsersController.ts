import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();



export const getAllUtilisateurs = async (req: Request, res: Response): Promise<Response> => {
    try {
      const utilisateurs = await prisma.utilisateur.findMany();
      return res.status(200).json(utilisateurs);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs." });
    }
  };
  
  // 2. Ajouter un utilisateur
  export const createUtilisateur = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { Nom, Prenom, Email, MdP, Role } = req.body;
  
      // Vérifiez que l'utilisateur n'existe pas déjà
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
    const { UtilisateurID } = req.params; // Assurez-vous d'avoir le paramètre ID dans l'URL
    try {
      const { Nom, Prenom, Email, MdP, Role } = req.body;
  
      const updatedUser = await prisma.utilisateur.update({
        where: { UtilisateurID: parseInt(UtilisateurID) }, // Convertir en entier
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
    const { UtilisateurID } = req.params; // Assurez-vous d'avoir le paramètre ID dans l'URL
    try {
      await prisma.utilisateur.delete({
        where: { UtilisateurID: parseInt(UtilisateurID) }, // Convertir en entier
      });
  
      return res.status(204).send(); // No content
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erreur lors de la suppression de l'utilisateur." });
    }
  };