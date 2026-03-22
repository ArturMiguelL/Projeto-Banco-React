import "dotenv/config"
import express from "express"
import cors from "cors"
import routes from "./src/Routes/Routes.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: "https://localhost:5173",
  methods: ["GET","POST","PUT","DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}))

app.use(express.json())

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("/", (req, res) => {
  res.send("API rodando ");
});

app.use("/api", routes)

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ erro: "Erro interno do servidor" });
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

const PORT =  process.env.DB_PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})