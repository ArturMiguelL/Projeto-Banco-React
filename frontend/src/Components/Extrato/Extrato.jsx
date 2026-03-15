import "./Extrato.css"
import { useState, useEffect } from "react";

export default function Extrato(){

    const [extratos, setExtratos] = useState([])

    useEffect(()=>{

        async function fetchExtrato() {

            const token = localStorage.getItem("token")

            const response = await fetch("http://localhost:3000/extrato",{
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
                    <td>ID</td>
                    <td>Valor</td>
                    <td>Descrição</td>
                    <td>Destino</td>
                    <td>Tipo</td>
                    <td>Data</td>
               </tr>
            </thead>
            <tbody>
                {extratos.map((item)=>(
                 <tr key={item.id}>
                    <td>{item.id}</td>
                    <td className={item.tipo === "credito" ? "credito" : "debito"}>
                     {item.valor}
                     </td>
                    <td>{item.descricao}</td>
                    <td>{item.destino}</td>
                    <td>{item.tipo}</td>
                    <td>{item.created_at}</td>
               </tr>
               ))}
            </tbody>
        </table>
        </div>
    );
}