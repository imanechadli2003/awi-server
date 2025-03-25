import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dashboardRoutes from './routes/dashboardRoutes';
import depotRoutes from './routes/depotRoutes'
import achatRoutes from './routes/achatroutes';
import vendeurroutes from "./routes/vendeurroutes";
import sessionroutes from "./routes/sessionroutes";

/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());
app.use(bodyParser.json());

/* EXEMPLE DE ROUTES */
app.use("/dashboard",dashboardRoutes);
app.use("/stocks",depotRoutes);
app.use("/achats",achatRoutes)
app.use("/vendeurs",vendeurroutes)
app.use("/sessions",sessionroutes);

/* LANCEMENT DU SERVEUR */
const port = Number(process.env.PORT) || 3001;  // Assurez-vous que c'est bien le port attendu
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
