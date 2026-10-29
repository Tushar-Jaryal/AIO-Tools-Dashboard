// Usage: npm run seed  (wipes the collections and reloads the sample data)
import mongoose from "mongoose";
import dotenv from "dotenv";
import { seedIfEmpty } from "./data/seed.js";

dotenv.config();
await mongoose.connect(process.env.MONGO_URL || "mongodb://127.0.0.1:27017/aiotools");
await seedIfEmpty({ force: true });
await mongoose.disconnect();
