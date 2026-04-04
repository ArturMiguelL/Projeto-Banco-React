import {db} from '../Database/db.js'
import { users } from '../Database/schema.js'
import { extrato } from '../Database/schema.js'
import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt"
import { desc, eq, sql } from 'drizzle-orm'

const SECRET = process.env.JWT_SECRET

function senhaForte(password){

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/

    return regex.test(password)
}

export const login = async (req,res) => {

    const {email, password } = req.body

    try{
        const result = await db.select().from(users).where(eq(users.email, email))

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
        console.error(err)
        return res.status(500).json({ message: "Erro interno" })
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

        const result = await db.select().from(users).where(eq(users.email, email))

        if(result.length > 0){
            return res.status(400).json({message:"Email já cadastrado"})
        }

        //gerar hash da senha
        const hash = await bcrypt.hash(password,10)

        await db.insert(users).values({ nome, email, password: hash, data_de_nascimento})

        return res.status(201).json({
            message:"Usuário cadastrado com sucesso"
        })

    }catch(err){
        return res.status(500).json(err)
    }
}

export const saldo = async(req, res)=> {
    // faltou essa linha
    const userId = req.user.id
    try {
     
        const result = await db.select({saldo: users.saldo }).from(users).where(eq(users.id, userId))

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

    await db.transaction(async (tx) => {

    
    const destino = await tx.select({ id: users.id, email: users.email})
        .from(users).where(eq(users.email, emailDestino))
        
    
    if(destino.length === 0){
        return res.status(404).json({message: "Usuário não encontrado"})
    }

    const destinoId = destino[0].id

    if(destinoId === remetenteId){
        return res.status(400).json({message: "Não pode se transferir para si mesmo"})
    }

    // verificar saldo
    const remetente = await tx.select({ id: users.id, saldo: users.saldo, email: users.email })
                .from(users).where(eq(users.id, remetenteId))
       
    
    if(Number(remetente[0].saldo) < valorNumero){
        return res.status(400).json({message: "Saldo insuficiente"})
    }

    // remover saldo do remetente
    await tx.update(users)
        .set({ saldo: sql`${users.saldo} - ${valorNumero}`})
        .where(eq(users.id, remetenteId))
    
    // adicionar saldo ao destinatário
    await tx.update(users)
        .set({ saldo: sql`${users.saldo} + ${valorNumero}`})
        .where(eq(users.id, destinoId))

    // registrar extrato para quem enviou
    await tx.insert(extrato).values({
        user_id: remetenteId,
                destino_id: destinoId,
                tipo: "saida",
                valor: valorNumero,
                descricao: `Transferência para ${emailDestino}`
    })

    // pegar email do remetente para registrar extrato do destinatário
    await tx.insert(extrato).values({
        user_id: destinoId,
                destino_id: remetenteId,
                tipo: "entrada",
                valor: valorNumero,
                descricao: `Recebido de ${remetente[0].email}`
    })

    res.json({message: "Transferência realizada"})

    console.log({remetenteId, destinoId, valorNumero})
    })
}catch(erro){
     console.error(erro)
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
        await db.transaction(async (tx) => {

        await tx.update(users)
        .set({ saldo: sql`${users.saldo} + ${valorNumero}`})
        .where(eq(users.id, userId))

        //registra no extrato
       await tx.insert(extrato).values({
        user_id: userId,
        destino_id: userId,
        tipo: "entrada",
        valor: valorNumero,
        descricao: descricao || "Depósito"
       })
        

    })
    res.json({message: "Depósito realizado com sucesso"})
    } catch (err) {
        console.error("ERRO DEPOSITO:", err)
     res.status(500).json({ message: "Erro no depósito" })
    }
}

export const getExtrato = async (req,res)=>{

    const userId = req.user.id

    try {
        const rows = await db
            .select({
                id: extrato.id,
                valor: extrato.valor,
                descricao: extrato.descricao,
                tipo: extrato.tipo,
                email_destino: users.email,
                created_at: extrato.created_at,
            })
            .from(extrato)
            .leftJoin(users, eq(extrato.destino_id, users.id))
            .where(eq(extrato.user_id, userId))
            .orderBy(desc(extrato.created_at))

            res.json(rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Erro ao buscar extrato" })
    }
}
