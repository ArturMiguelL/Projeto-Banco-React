import "dotenv/config"
import express from "express"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import routes from "./src/Routes/Routes.js"

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:4173","http://localhost:5174" ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}))

app.use(express.json())
app.use("/api", routes)

// rota de teste
app.get("/api/teste", (req, res) => {
    res.json({ ok: true })
})

app.use(express.static(path.join(__dirname, "../frontend/dist")))

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ erro: "Erro interno do servidor" })
})

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"))
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})