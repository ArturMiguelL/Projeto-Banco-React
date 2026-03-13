import { db } from '../db.js'


export const login = (req,res) => {

    const {email, password } = req.body

    const sql = "SELECT * FROM users WHERE email = ? AND password = ?"

    db.query(sql, [email, password], (err, result)=>{

        if(err){
            return res.status(500).json(err)
        }

        if(result.length === 0){
            return res.status(401).json("Email ou Senha inválidos")
        }

    })
}

export const cadastro = (req, res) => {

    const { nome, email, password, data_de_nascimento } = req.body

    const checkEmail = "SELECT * FROM users WHERE email = ?"

    db.query(checkEmail, [email], (err, result) => {

        if (err) {
            return res.status(500).json(err)
        }

        if (result.length > 0) {
            return res.status(400).json("Email já cadastrado")
        }

        const insertUser = `
            INSERT INTO users (nome,email,password,data_de_nascimento)
            VALUES (?,?,?,?)
        `

        db.query(insertUser, [nome, email, password, data_de_nascimento], (err, result) => {

            if (err) {
                return res.status(500).json(err)
            }

            res.status(201).json({
                message: "Usuário cadastrado com sucesso"
            })

        })

    })
}