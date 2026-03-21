import { useState } from "react";
import { useNavigate } from "react-router-dom";
import  NavBar  from "../../Components/navbar/NavBar";
import "./Deposito.css"
import axios from "axios";

axios.defaults.baseURL=
    import.meta.env.MODE === "development"
        ? "http://localhost:3000/api"
        : "https://projeto-banco-react.onrender.com";
        
export default function Deposito(){

    const [ valor, setValor] = useState("")
    const [ descricao, setDescricao] = useState("")
    const navigate = useNavigate()

    async function handleSubmit(e) {

        e.preventDefault()

        const token = localStorage.getItem("token")

        const response = await fetch(`${API_URL}/deposito`,{
            method:"POST",
            headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${token}`
            },
            body:JSON.stringify({
                valor,
                descricao
            })
        })
        

        if(response.ok){
            alert("Saldo adicionado")
            navigate("/principal")
        }
    }

    return(
        <div className="deposito-container">
            <NavBar />

            <div className="deposito-card">
            <h1>Adicionar saldo</h1>

            <form onSubmit={handleSubmit} className="deposito-form">

                <div className="form-group">
                <label>Valor</label>
                <input
                type="number"
                placeholder="Valor"
                value={valor}
                onChange={(e)=>setValor(e.target.value)}
                required
                />
                </div>

                <div className="form-group">
                <label>Descrição</label>
                <input
                type="text"
                placeholder="Descrição"
                value={descricao}
                onChange={(e)=>setDescricao(e.target.value)}
                />
                </div>

                <button className="btn-depositar">Depositar</button>

            </form>
        </div>
        </div>
    )
}