import "dotenv/config"
import express from "express"
import cors from "cors"
import routes from "./src/Routes/Routes.js";

const app = express()

app.use(cors({
  origin: true,
  credentials: true
}))

app.use(express.json())

app.get("/", (req, res) => {
  res.send("API rodando 🚀");
});

app.use("/", routes)

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ erro: "Erro interno do servidor" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})