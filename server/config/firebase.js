import dotenv from "dotenv";

dotenv.config();

import { initializeApp, cert } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));



const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64
  ? JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, "base64").toString("utf-8"))
  : JSON.parse(readFileSync(join(__dirname, "../firebase-service-account.json"), "utf-8"));

const firebaseApp = initializeApp({
  credential: cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

export const db = getDatabase(firebaseApp);