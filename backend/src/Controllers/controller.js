import db from '../Database/db.js'
import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt"

const SECRET = process.env.JWT_SECRET

function senhaForte(password){

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/

    return regex.test(password)
}

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
            { expiresIn: "20m"}
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

export const saldo = async(req, res)=> {
    try {
        const userId = req.user.id
        const sql = 'SELECT saldo FROM users WHERE id = ?'
        const [result] = await db.query(sql, [userId])

        if(result.length === 0){
            return res.status(404).json({ message: 'Usuário não encontrado'})
        }
        res.status(200).json({ saldo: result[0].saldo})
        
    } catch (err) {
         res.status(500).json(err)
    }
}

export const transferencia = async(req, res) => {

    try{

    const { emailDestino, valor } = req.body
    const remetenteId = req.user.id
    const valorNumero = Number(valor)

    // buscar usuário destino
    const [destino] = await db.query(
        "SELECT id FROM users WHERE email = ?", [emailDestino]
    )

    if(destino.length === 0){
        return res.status(404).json({message: "Usuário não encontrado"})
    }

    const destinoId = destino[0].id

    if(destinoId === remetenteId){
        return res.status(400).json({message: "Não pode se transferir para si mesmo"})
    }

    // verificar saldo
    const [user] = await db.query(
        "SELECT saldo FROM users WHERE id = ?", [remetenteId]
    )
    if(user[0].saldo < valorNumero){
        return res.status(400).json({message: "Saldo insuficiente"})
    }

    // remover saldo do remetente
    await db.query(
        "UPDATE users SET saldo = saldo - ? WHERE id = ?", [valorNumero, remetenteId]
    )

    // adicionar saldo ao destinatário
    await db.query(
        "UPDATE users SET saldo = saldo + ? WHERE id = ?", [valorNumero, destinoId]
    )

    // registrar extrato para quem enviou
    await db.query(
        "INSERT INTO extrato (user_id, destino_id, tipo, valor, descricao) VALUES (?,?,?,?,?)",
        [remetenteId, destinoId, "saida", valorNumero, `Transferência para ${emailDestino}`]
    )

    // pegar email do remetente para registrar extrato do destinatário
    const [remetente] = await db.query(
        "SELECT email FROM users WHERE id = ?", [remetenteId]
    )
    const emailRemetente = remetente[0].email;

    // registrar extrato para quem recebeu
    await db.query(
        "INSERT INTO extrato (user_id, destino_id, tipo, valor, descricao) VALUES (?,?,?,?,?)",
        [destinoId, remetenteId, "entrada", valorNumero, `Recebido de ${emailRemetente}`]
    )

    res.json({message: "Transferência realizada"})

    console.log({remetenteId, destinoId, valorNumero})
}catch(erro){
     console.error(error)
      return res.status(500).json({message: "Erro interno do servidor"})
  }
}

export const deposito = async (req,res)=>{

    const { valor, descricao} = req.body
    const userId = req.user.id
    const valorNumero = Number(valor)

    if(!valorNumero || valorNumero <= 0){
        return res.status(400).json({message:"Valor inválido"})
    }

    try {
        //adciona saldo
        await db.query(
        "UPDATE users SET saldo = saldo + ? WHERE id = ?", [valorNumero, userId]
        )

        //registra no extrato
       await db.query(
        "INSERT INTO extrato (user_id, destino_id, tipo, valor, descricao) VALUES(?, ?, 'entrada', ?, ?)",
        [userId, userId, valorNumero, descricao || "Depósito"]
        )

        res.json({message: "Depósito realizado com sucesso"})
    } catch (err) {
        res.status(500).json({message:"Erro no depósito"})
    }
}

export const extrato = async (req,res)=>{

    const userId = req.user.id

    const [rows] = await db.query(
        `SELECT 
        e.id,
        e.valor,
        e.descricao,
        e.tipo,
        u.email AS email_destino,
        DATE_FORMAT(e.created_at, '%d/%m/%Y %H:%i') as created_at
        FROM extrato e
        LEFT JOIN users u ON e.destino_id = u.id
        WHERE e.user_id = ?
        ORDER BY e.created_at DESC`,
        [userId]
    )

    res.json(rows)
}

