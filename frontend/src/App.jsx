import { BrowserRouter, Route, Routes } from "react-router-dom";
import Cadastro from "./Pages/Cadastro.jsx";
import Login from "./Pages/Login.jsx";
import Principal from "./Pages/Principal.jsx";

export default function App(){

    return(

        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />}/>
                <Route path="/cadastro" element={<Cadastro />}/>


                <Route path="/pricipal" element={<Principal />}/>

            </Routes>
        
        </BrowserRouter>
    )
}