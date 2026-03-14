import express from 'express'
import { login, cadastro  } from '../Controllers/controller.js'

const router = express.Router()

router.post("/", login)
router.post("/cadastro", cadastro)

export default router