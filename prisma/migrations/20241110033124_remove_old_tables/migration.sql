/*
  Warnings:

  - You are about to drop the column `ID_Acheteur` on the `Achat` table. All the data in the column will be lost.
  - You are about to drop the column `Balance` on the `Vendeur` table. All the data in the column will be lost.
  - You are about to drop the `Acheteur` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Facture` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[Email]` on the table `Utilisateur` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `quantite_disponible` to the `Jeu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Description` to the `JeuxMarque` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Achat" DROP CONSTRAINT "Achat_ID_Acheteur_fkey";

-- DropForeignKey
ALTER TABLE "Facture" DROP CONSTRAINT "Facture_id_session_fkey";

-- AlterTable
CREATE SEQUENCE achat_achatid_seq;
ALTER TABLE "Achat" DROP COLUMN "ID_Acheteur",
ALTER COLUMN "AchatID" SET DEFAULT nextval('achat_achatid_seq');
ALTER SEQUENCE achat_achatid_seq OWNED BY "Achat"."AchatID";

-- AlterTable
CREATE SEQUENCE depot_id_depot_seq;
ALTER TABLE "Depot" ALTER COLUMN "ID_depot" SET DEFAULT nextval('depot_id_depot_seq');
ALTER SEQUENCE depot_id_depot_seq OWNED BY "Depot"."ID_depot";

-- AlterTable
CREATE SEQUENCE jeu_jeuid_seq;
ALTER TABLE "Jeu" ADD COLUMN     "quantite_disponible" INTEGER NOT NULL,
ALTER COLUMN "JeuID" SET DEFAULT nextval('jeu_jeuid_seq');
ALTER SEQUENCE jeu_jeuid_seq OWNED BY "Jeu"."JeuID";

-- AlterTable
ALTER TABLE "JeuxMarque" ADD COLUMN     "Description" TEXT NOT NULL;

-- AlterTable
CREATE SEQUENCE session_idsession_seq;
ALTER TABLE "Session" ALTER COLUMN "idSession" SET DEFAULT nextval('session_idsession_seq');
ALTER SEQUENCE session_idsession_seq OWNED BY "Session"."idSession";

-- AlterTable
CREATE SEQUENCE utilisateur_utilisateurid_seq;
ALTER TABLE "Utilisateur" ALTER COLUMN "UtilisateurID" SET DEFAULT nextval('utilisateur_utilisateurid_seq');
ALTER SEQUENCE utilisateur_utilisateurid_seq OWNED BY "Utilisateur"."UtilisateurID";

-- AlterTable
CREATE SEQUENCE vendeur_vendeurid_seq;
ALTER TABLE "Vendeur" DROP COLUMN "Balance",
ALTER COLUMN "VendeurID" SET DEFAULT nextval('vendeur_vendeurid_seq');
ALTER SEQUENCE vendeur_vendeurid_seq OWNED BY "Vendeur"."VendeurID";

-- DropTable
DROP TABLE "Acheteur";

-- DropTable
DROP TABLE "Facture";

-- CreateIndex
CREATE INDEX "Achat_id_session_idx" ON "Achat"("id_session");

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_Email_key" ON "Utilisateur"("Email");
