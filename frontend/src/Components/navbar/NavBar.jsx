import { useNavigate, Link } from "react-router-dom";
import "./navbar.css"

export default function NavBar(){

    const navigate = useNavigate()

 function handleLogout(){
    localStorage.removeItem("token")
    navigate("/")
 }

 return(

    <header >
        <nav>
            <h1>Projeto Bank</h1>  
            <div>
            <Link to="/principal">Home</Link>
            <Link to="/transferencia">Transferência</Link>
            <Link to="/deposito">Adicionar saldo</Link>
            <Link to="/estatisticas">Estatísticas</Link>
            <Link to="/" onClick={handleLogout}>sair</Link>
            </div>
        </nav>
    </header>
 )
}