import { useState } from "react";
import { useNavigate, Link} from "react-router-dom";
import axios from "axios";

axios.defaults.baseURL=
    import.meta.env.MODE === "development"
        ? "http://localhost:3000/api"
        : "https://projeto-banco-react.onrender.com/api";


export default function Login(){

    const navigate = useNavigate()

    const [email, setEmail]  = useState("")
    const [password, setPassword]  = useState("")

    async function handleSubmit(e){

        e.preventDefault()
        try{
         const response = await axios.post("/",{
                email,
                password
            })

         const data = await response.data

         localStorage.setItem("token", data.token)

            navigate('/principal')
        }catch(err){
             console.error(err)

        const mensagem = err.response?.data?.message || "Erro ao fazer login"
        alert(mensagem)
        }
    }
    return(

        <div className="container">

            <form onSubmit={handleSubmit}>

                <h2>Login</h2>

                <div className="input-group">
                    <label>Email: </label>
                    <input type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required />
                </div>

                <div className="input-group">
                    <label>Senha: </label>
                    <input name="password" type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required />
                </div>

                <button type="submit" className="btn">Entrar</button>
            </form>
                <p className="link-page">
                    Não tem conta? <Link to="/cadastro">Cadastra-se</Link>
               </p>
        </div>
    )
}