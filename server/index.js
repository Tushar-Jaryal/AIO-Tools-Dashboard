import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import clientRoutes from "./routes/client.js";
import generalRoutes from "./routes/general.js";
import managementRoutes from "./routes/management.js";
import salesRoutes from "./routes/sales.js";
import { seedIfEmpty } from "./data/seed.js";

/* CONFIGURATION */
dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(express.urlencoded({ extended: false }));
app.use(cors());

/* ROUTES */
const api = express.Router();
api.use("/client", clientRoutes);
api.use("/general", generalRoutes);
api.use("/management", managementRoutes);
api.use("/sales", salesRoutes);
api.get("/health", (req, res) => res.json({ ok: true }));
app.use("/api", api);

/* SERVE THE BUILT CLIENT (production / Docker) */
const clientBuild = process.env.CLIENT_BUILD_DIR || path.join(__dirname, "../client/build");
if (fs.existsSync(path.join(clientBuild, "index.html"))) {
  app.use(express.static(clientBuild));
  app.get(/^\/(?!api\/).*/, (req, res) =>
    res.sendFile(path.join(clientBuild, "index.html"))
  );
}

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 9000;
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/aiotools";

mongoose
  .connect(MONGO_URL)
  .then(async () => {
    // Load the sample data the first time the app starts on an empty database
    await seedIfEmpty();
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => {
    console.log(`${error} did not connect`);
    process.exit(1);
  });
