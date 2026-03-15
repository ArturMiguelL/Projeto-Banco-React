import NavBar from "../../Components/navbar/NavBar";
import { useState } from "react";
import "./Transferencia.css"

export default function Transferencia(){

    const [emailDestino, setEmailDestino] = useState("")
    const [valor, setValor] = useState("")
    const [descricao, setDescricao] = useState("")

    async function handleSubmit(e) {
        e.preventDefault()

        const token = localStorage.getItem("token")

        const response = await fetch("http://localhost:3000/transferencia", {
            method: "POST",
            headers:{
                "Content-Type":"application/json",
                  Authorization:`Bearer ${token}`
            },
            body: JSON.stringify({
                emailDestino,
                valor,
                descricao
            })
        })
        const data = await response.json()

        if(response.ok){
            alert("Transferência realizada")
        }else{
            alert(data.message)
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

                <div className="form-group">
                <label>Descrição</label>
                 <input 
                type="text"
                placeholder="Ex: almoço, aluguel, salário"
                value={descricao}
                onChange={(e)=> setDescricao(e.target.value)}
                required
                 />
                 </div>

                 <div className="form-group">
                <label>Tipo de operação</label>
                <select>
                <option value="debito">Saída</option>
                <option value="credito">Entrada</option>
                </select>
                </div>

                <div className="form-group">
                <label>Forma de pagamento</label>
                <select>
                <option value="pix">Pix</option>
                <option value="debito">Cartão Débito</option>
                <option value="credito">Cartão Crédito</option>
                </select>
                </div>

                 <button className="btn-transferir" type="submit">Transferir</button>
            </form>

        </div>
        </div>
    )
}