import NavBar from "../Components/navbar/NavBar"
import Card from "../Components/Card/Card"
import Extrato from "../Components/Extrato/Extrato"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./principal.css"

axios.defaults.baseURL=
    import.meta.env.MODE === "development"
        ? "http://localhost:3000/api"
        : "http://localhost:3000/api"; 

export default function Principal(){
  const [saldo, setSaldo ] = useState(null);
  const navigate = useNavigate()

  useEffect(() =>{
    async function fetchSaldo(){
      try {
        const token = localStorage.getItem('token'); // token salvo no localstorage
        const response = await fetch(`${API_URL}/saldo`, {
          headers: { 'Authorization': `Bearer ${token}`}
        });
        const data = await response.json()
        setSaldo(data.saldo)
      } catch (error) {
        console.error('Erro ao buscar saldo', error)
      }
    }
    fetchSaldo();
  }, []);

 return(
    <div >
     <NavBar />
     <div className="cards-container">
    <Card titulo="Saldo na conta" saldo={saldo} />

    <Card 
    titulo="Fazer transferência" 
    saldo="Enviar ou receber dinheiro"
    onClick={() => navigate("/transferencia")}
    />

    <Card 
    titulo="Adicionar saldo"
    saldo="Depositar dinheiro"
    onClick={() => navigate("/deposito")}
    />

    <Card 
    titulo="Estatisticas" 
    saldo="Estatisticas de saída e entrada"
    onClick={() => navigate("/Estatisticas")}
    />
    </div>
    <Extrato />

   </div>
 )
}
