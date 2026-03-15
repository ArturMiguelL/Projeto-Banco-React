import { BrowserRouter, Route, Routes } from "react-router-dom";
import Cadastro from "./Pages/Cadastro.jsx";
import Login from "./Pages/Login.jsx";
import Principal from "./Pages/Principal.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import Transferencia from "./Pages/transferencia/Transferencia.jsx";
import Deposito from "./Pages/Deposito/Deposito.jsx";


export default function App(){

    return(

        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />}/>
                <Route path="/cadastro" element={<Cadastro />}/>


                <Route path="/principal" 
                element={
                <ProtectedRoute>
                <Principal />
                </ProtectedRoute>
                }/>

                 <Route
                path="/transferencia"
                element={
                <ProtectedRoute>
                <Transferencia />
                </ProtectedRoute>
                }
                />

                <Route
                path="/deposito"
                element={
                <ProtectedRoute>
                <Deposito/>
                </ProtectedRoute>
                }
                />

            </Routes>
        
        </BrowserRouter>
    )
}