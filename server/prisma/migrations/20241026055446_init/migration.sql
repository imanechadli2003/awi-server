-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Manager', 'Admin');

-- CreateTable
CREATE TABLE "JeuxMarque" (
    "JeuRef_id" INTEGER NOT NULL,
    "Nom" TEXT NOT NULL,
    "Editeur" TEXT NOT NULL,

    CONSTRAINT "JeuxMarque_pkey" PRIMARY KEY ("JeuRef_id")
);

-- CreateTable
CREATE TABLE "Jeu" (
    "JeuID" INTEGER NOT NULL,
    "JeuRef_id" INTEGER NOT NULL,
    "depot_ID" INTEGER NOT NULL,
    "prix_unitaire" DOUBLE PRECISION NOT NULL,
    "mise_en_vente" BOOLEAN NOT NULL,

    CONSTRAINT "Jeu_pkey" PRIMARY KEY ("JeuID")
);

-- CreateTable
CREATE TABLE "Depot" (
    "ID_depot" INTEGER NOT NULL,
    "VendeurID" INTEGER NOT NULL,
    "date_depot" TIMESTAMP(3) NOT NULL,
    "id_session" INTEGER NOT NULL,
    "comission_depot_total" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Depot_pkey" PRIMARY KEY ("ID_depot")
);

-- CreateTable
CREATE TABLE "Vendeur" (
    "VendeurID" INTEGER NOT NULL,
    "Nom" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Telephone" TEXT NOT NULL,
    "Balance" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Vendeur_pkey" PRIMARY KEY ("VendeurID")
);

-- CreateTable
CREATE TABLE "DepotJeu" (
    "depot_ID" INTEGER NOT NULL,
    "JeuID" INTEGER NOT NULL,
    "quantite_depose" INTEGER NOT NULL,
    "comission_depot" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "DepotJeu_pkey" PRIMARY KEY ("depot_ID","JeuID")
);

-- CreateTable
CREATE TABLE "Achat" (
    "AchatID" INTEGER NOT NULL,
    "Total_paye" DOUBLE PRECISION NOT NULL,
    "id_session" INTEGER NOT NULL,
    "DateAchat" TIMESTAMP(3) NOT NULL,
    "comission_vente_total" DOUBLE PRECISION NOT NULL,
    "ID_Acheteur" INTEGER NOT NULL,

    CONSTRAINT "Achat_pkey" PRIMARY KEY ("AchatID")
);

-- CreateTable
CREATE TABLE "AchatJeu" (
    "AchatID" INTEGER NOT NULL,
    "JeuID" INTEGER NOT NULL,
    "comission_vente" DOUBLE PRECISION NOT NULL,
    "quantite_achete" INTEGER NOT NULL,

    CONSTRAINT "AchatJeu_pkey" PRIMARY KEY ("AchatID","JeuID")
);

-- CreateTable
CREATE TABLE "Acheteur" (
    "AcheteurID" INTEGER NOT NULL,
    "Nom" TEXT NOT NULL,
    "Prenom" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Telephone" TEXT NOT NULL,
    "Adresse" TEXT NOT NULL,

    CONSTRAINT "Acheteur_pkey" PRIMARY KEY ("AcheteurID")
);

-- CreateTable
CREATE TABLE "Facture" (
    "id_facture" INTEGER NOT NULL,
    "id_session" INTEGER NOT NULL,
    "ID_Acheteur" INTEGER NOT NULL,

    CONSTRAINT "Facture_pkey" PRIMARY KEY ("id_facture")
);

-- CreateTable
CREATE TABLE "Session" (
    "idSession" INTEGER NOT NULL,
    "NomSession" TEXT NOT NULL,
    "DateDebut" TIMESTAMP(3) NOT NULL,
    "DateFin" TIMESTAMP(3),
    "pourc_frais_depot" DOUBLE PRECISION NOT NULL,
    "pourc_frais_vente" DOUBLE PRECISION NOT NULL,
    "Statut" BOOLEAN NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("idSession")
);

-- CreateTable
CREATE TABLE "Utilisateur" (
    "UtilisateurID" INTEGER NOT NULL,
    "Nom" TEXT NOT NULL,
    "Prenom" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "MdP" TEXT NOT NULL,
    "Role" "Role" NOT NULL,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("UtilisateurID")
);

-- CreateTable
CREATE TABLE "BilanVendeurSession" (
    "id_vendeur" INTEGER NOT NULL,
    "id_session" INTEGER NOT NULL,
    "total_depots" INTEGER NOT NULL,
    "total_ventes" INTEGER NOT NULL,
    "total_stocks" INTEGER NOT NULL,
    "total_gains" DOUBLE PRECISION NOT NULL,
    "total_comissions" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "BilanVendeurSession_pkey" PRIMARY KEY ("id_vendeur","id_session")
);

-- AddForeignKey
ALTER TABLE "Jeu" ADD CONSTRAINT "Jeu_depot_ID_fkey" FOREIGN KEY ("depot_ID") REFERENCES "Depot"("ID_depot") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jeu" ADD CONSTRAINT "Jeu_JeuRef_id_fkey" FOREIGN KEY ("JeuRef_id") REFERENCES "JeuxMarque"("JeuRef_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Depot" ADD CONSTRAINT "Depot_VendeurID_fkey" FOREIGN KEY ("VendeurID") REFERENCES "Vendeur"("VendeurID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Depot" ADD CONSTRAINT "Depot_id_session_fkey" FOREIGN KEY ("id_session") REFERENCES "Session"("idSession") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepotJeu" ADD CONSTRAINT "DepotJeu_depot_ID_fkey" FOREIGN KEY ("depot_ID") REFERENCES "Depot"("ID_depot") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepotJeu" ADD CONSTRAINT "DepotJeu_JeuID_fkey" FOREIGN KEY ("JeuID") REFERENCES "Jeu"("JeuID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achat" ADD CONSTRAINT "Achat_id_session_fkey" FOREIGN KEY ("id_session") REFERENCES "Session"("idSession") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achat" ADD CONSTRAINT "Achat_ID_Acheteur_fkey" FOREIGN KEY ("ID_Acheteur") REFERENCES "Acheteur"("AcheteurID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchatJeu" ADD CONSTRAINT "AchatJeu_AchatID_fkey" FOREIGN KEY ("AchatID") REFERENCES "Achat"("AchatID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchatJeu" ADD CONSTRAINT "AchatJeu_JeuID_fkey" FOREIGN KEY ("JeuID") REFERENCES "Jeu"("JeuID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facture" ADD CONSTRAINT "Facture_id_session_fkey" FOREIGN KEY ("id_session") REFERENCES "Session"("idSession") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BilanVendeurSession" ADD CONSTRAINT "BilanVendeurSession_id_vendeur_fkey" FOREIGN KEY ("id_vendeur") REFERENCES "Vendeur"("VendeurID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BilanVendeurSession" ADD CONSTRAINT "BilanVendeurSession_id_session_fkey" FOREIGN KEY ("id_session") REFERENCES "Session"("idSession") ON DELETE RESTRICT ON UPDATE CASCADE;
