import express from "express"
import cors from "cors"
import routes from "./src/Routes.js";

const PORT = 3000;

const app = express()
app.use(cors({
    origin: "*",
    methods: ["GET","POST","PUT","DELETE"],
    allowedHeaders: ["Content-Type"]
}))
app.use(express.json())

app.use("/", routes)


app.listen(PORT, ()=>{
    console.log(`Servidor rodando com succeso em http://localhost:${PORT}`)
})