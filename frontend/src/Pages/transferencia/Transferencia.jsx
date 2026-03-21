import NavBar from "../../Components/navbar/NavBar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Transferencia.css"
import axios from "axios";

axios.defaults.baseURL=
    import.meta.env.MODE === "development"
        ? "http://localhost:3000/api"
        : "https://projeto-banco-react.onrender.com";

export default function Transferencia(){

    const [emailDestino, setEmailDestino] = useState("")
    const [valor, setValor] = useState("")
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()

        try{

        const token = localStorage.getItem("token")

        const response = await fetch(`${API_URL}/transferencia`, {
            method: "POST",
            headers:{
                "Content-Type":"application/json",
                  Authorization:`Bearer ${token}`
            },
            body: JSON.stringify({
                emailDestino,
                valor
            })
        })
        const data = await response.json()

        if(response.ok){
            alert("Transferência realizada")
            navigate("/principal")
        }else{
            alert(data.message)
        }  
        
        }catch(err){
            console.error(err)
            alert("Erro ao conectar com servidor")
        }
    }
    return(
        <div className="transferencia-container">
            <NavBar />
            <div className="transferencia-card">

            <h1>Nova Transferência</h1>

            <form onSubmit={handleSubmit} className="transferencia-form">

                <div className="form-group">
                <label>Email do destinatário</label>
                <input 
                type="email"
                placeholder="usuario@email.com"
                value={emailDestino}
                onChange={(e)=> setEmailDestino(e.target.value)}
                required
                 />
                 </div>

                 <div className="form-group">
                <label>Valor</label>
                <input 
                type="number"
                placeholder="R$ 0,00"
                value={valor}
                onChange={(e)=> setValor(e.target.value)}
                required
                 />
                 </div>              

                 <button className="btn-transferir" type="submit">Transferir</button>
            </form>

        </div>
        </div>
    )
}