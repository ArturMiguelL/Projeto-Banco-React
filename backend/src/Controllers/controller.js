import { db } from '../Database/db.js'
import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt"

const SECRET = process.env.JWT_SECRET


export const login = async (req,res) => {

    const {email, password } = req.body

    try{

        const sql = "SELECT * FROM users WHERE email = ?"

        const [result] = await db.query(sql,[email])

        if(result.length === 0){
            return res.status(401).json({message:"Email ou senha inválidos"})
        }

        const user = result[0]

        const senhaValida = await bcrypt.compare(password,user.password)

        if(!senhaValida){
            return res.status(401).json({message: "Email ou senha inválidos"})
        }

        const token = jwt.sign(
            { id: user.id, email: user.email},
            SECRET,
            { expiresIn: "15m"}
        )

        res.status(200).json({
          message:"Login realizado",
         token,
         user:{
        id:user.id,
        nome:user.nome,
        email:user.email
    }
})


    }catch(err){
        return res.status(500).json(err)
    }
}

export const cadastro = async (req, res) => {

    const { nome, email, password, data_de_nascimento } = req.body

    if(!senhaForte(password)){

        return res.status(400).json({
            message:"Senha fraca. Use 8 caracteres, maiúscula, número e símbolo."
        })
    }

    try{

        const checkEmail = "SELECT * FROM users WHERE email = ?"

        const [result] = await db.query(checkEmail,[email])

        if(result.length > 0){
            return res.status(400).json({message:"Email já cadastrado"})
        }

        //gerar hash da senha
        const hash = await bcrypt.hash(password,10)

        const insertUser = `
        INSERT INTO users (nome,email,password,data_de_nascimento)
        VALUES (?,?,?,?)
        `

         await db.query(insertUser,[nome,email,hash,data_de_nascimento])

        return res.status(201).json({
            message:"Usuário cadastrado com sucesso"
        })

    }catch(err){
        return res.status(500).json(err)
    }
}

function senhaForte(password){

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/

    return regex.test(password)
}