import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

axios.defaults.baseURL=
    import.meta.env.MODE === "development"
        ? "http://localhost:3000/api"
        : "https://projeto-banco-react.onrender.com/api";

export default function Cadastro(){

    const navigate = useNavigate()
    
    const [nome, setNome]  = useState("")
    const [email, setEmail]  = useState("")
    const [password, setPassword]  = useState("")
    const [data_de_nascimento, setData_de_nascimento]  = useState("")

   async function handleSubmit(e){

       
        e.preventDefault()

        try{
        const response = await axios.post("/cadastro",{
                nome,
                email,
                password,
                data_de_nascimento
            })  

            navigate('/')
      
    }catch(err){
         console.error(err)

        const mensagem = err.response?.data?.message || "Erro ao cadastrar"
        alert(mensagem)
    }
    }


        return(

             <div className="container">

            <form onSubmit={handleSubmit}>

                <h2>Cadastro</h2>

                <div className="input-group">
                    <label>Nome: </label>
                    <input name="nome" value={nome} 
                    onChange={(e) => setNome(e.target.value)}
                    required />
                </div>

                <div className="input-group">
                    <label>Email: </label>
                    <input type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                   required />
                </div>

                <div className="input-group">
                    <label>Senha: </label>
                    <input
                     name="password" type="password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     required/>
                </div>

                <div className="input-group">
                    <label>Data de nascimento: </label>
                    <input
                     name="data_de_nascimento" type="date"
                     value={data_de_nascimento}
                     onChange={(e) => setData_de_nascimento(e.target.value)}
                     required/>
                </div>

                <button type="submit" className="btn">Cadastrar</button>
            </form>
                <p className="link-page">
                    Já possui conta? <Link to="/">Entrar</Link>
               </p>
        </div>


        )
    }


