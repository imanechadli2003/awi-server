"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const depotRoutes_1 = __importDefault(require("./routes/depotRoutes"));
const achatroutes_1 = __importDefault(require("./routes/achatroutes"));
const vendeurroutes_1 = __importDefault(require("./routes/vendeurroutes"));
const sessionroutes_1 = __importDefault(require("./routes/sessionroutes"));
/* CONFIGURATIONS */
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use((0, morgan_1.default)("common"));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
/* EXEMPLE DE ROUTES */
app.use("/dashboard", dashboardRoutes_1.default);
app.use("/stocks", depotRoutes_1.default);
app.use("/achats", achatroutes_1.default);
app.use("/vendeurs", vendeurroutes_1.default);
app.use("/sessions", sessionroutes_1.default);
/* LANCEMENT DU SERVEUR */
const port = Number(process.env.PORT) || 3001; // Assurez-vous que c'est bien le port attendu
app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
});
