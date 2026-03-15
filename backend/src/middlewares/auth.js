import jwt from 'jsonwebtoken'
const SECRET = process.env.JWT_SECRET

export const verificarToken = (req, res, next)=>{

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(!token)return res.status(401).json({ message: 'Token não fornecido'})

    jwt.verify(token, SECRET, (err, user)=>{
        if(err) return res.status(403).json({ message: 'Token inválido'})
            req.user = user // user.id e user.email
        next()
    })

    
}