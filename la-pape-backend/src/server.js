// src/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

// 1) CORS: usa el origen real del front (ajústalo si usas otro puerto)
const FRONT = process.env.FRONTEND_ORIGIN || "http://localhost:3000";
app.use(cors({
  origin: FRONT,
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
// preflight
app.options("*", cors({ origin: FRONT, credentials: true }));

// 2) Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.get("/", (_req, res) => res.json({ ok: true, name: "La Pape API (Mongo)" }));
app.get("/health", (_req, res) => res.json({ ok: true, ts: Date.now() }));
app.use("/auth", authRoutes);

// 3) 404 y errores
app.use((req, res, next) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

app.use((err, req, res, _next) => {
  console.error("🔥 Error handler:", err);
  const status = err.status || err.code || 500;
  res.status(Number.isInteger(status) ? status : 500)
     .json({ error: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => app.listen(PORT, () => console.log(`🚀 API http://localhost:${PORT}`)))
  .catch((e) => {
    console.error("❌ Error conectando a MongoDB:", e);
    process.exit(1);
  });
