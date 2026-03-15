import express from 'express'
import { login, cadastro, saldo, transferencia, deposito, extrato  } from '../Controllers/controller.js'
import { verificarToken } from '../middlewares/auth.js'

const router = express.Router()

router.post("/", login)
router.post("/cadastro", cadastro)
router.get("/saldo", verificarToken, saldo)
router.post("/transferencia", verificarToken, transferencia)
router.post("/deposito", verificarToken, deposito)
router.get("/extrato", verificarToken, extrato)

export default router