import "./Extrato.css"
import { useState, useEffect } from "react";
import { API_URL } from "../../api";

export default function Extrato(){

    const [extratos, setExtratos] = useState([])

    useEffect(()=>{

        async function fetchExtrato() {

            const token = localStorage.getItem("token")

            const response = await fetch(`${API_URL}/extrato`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })

            const data = await response.json()

            setExtratos(data)
        }
        fetchExtrato()
    },[])

    return(
        <div className="extrato-container-wrapper">
        <div className="header-lista">
            <h2>Extratos da conta</h2>
        </div>

        <table className="extrato-container">
            <thead>
                <tr>
                    <td>Valor</td>
                    <td>Descrição</td>
                    <td>Destino/Recebido</td>
                    <td>Tipo</td>
                    <td>Data</td>
               </tr>
            </thead>
            <tbody>
                {extratos.map((item)=>(
                 <tr key={item.id}>
                    <td className={item.tipo === "entrada" || item.tipo === "deposito" ? "credito" : "debito"}>
                        R$ {item.valor}
                        </td>
                    <td>{item.descricao}</td>
                    <td>{item.email_destino}</td>
                    <td>{item.tipo}</td>
                    <td>{item.created_at}</td>
               </tr>
               ))}
            </tbody>
        </table>
        </div>
    );
}