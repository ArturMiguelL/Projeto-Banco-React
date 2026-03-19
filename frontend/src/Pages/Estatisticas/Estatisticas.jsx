import "./Estatisticas.css"
import NavBar from "../../Components/navbar/NavBar"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, PieChart, Pie, Tooltip } from "recharts"
import { useEffect, useState } from "react"
import { API_URL } from "../../api"

export default function Estatisticas({ dados = [] }) {

    const cores = ["#2ecc71", "#e74c3c", "#6c5ce7"]
    const [extratos, setExtratos] = useState([])
    const dadosPorMes = {}

    useEffect(() => {
        async function fetchExtrato(){
            const token = localStorage.getItem("token")

            const response = await fetch(`${API_URL}/extrato`,{
                headers:{
                    Authorization: `Bearer ${token}`
                }
        })

        const data = await response.json()
        setExtratos(data)
        }
        fetchExtrato()
    }, [])

    // Const das entradas e saidas do extratos
    const totalEntradas = extratos
        .filter(item => item.tipo === "entrada")
        .reduce((acc, item) => acc + Number(item.valor), 0)

    const totalSaidas = extratos
        .filter(item => item.tipo === "saida")
        .reduce((acc, item) => acc + Number(item.valor), 0)

     const dadosFormatados = [
        { tipo: "Entradas", valor: totalEntradas },
        { tipo: "Saídas", valor: totalSaidas }
      ]

      function parseData(dataString) {
    if (!dataString) return null;

    // formato brasileiro: DD/MM/YYYY HH:mm:ss
    if (dataString.includes("/")) {
        const [dataParte, horaParte] = dataString.split(" ");
        const [dia, mes, ano] = dataParte.split("/");

        return new Date(`${ano}-${mes}-${dia}T${horaParte || "00:00:00"}`);
    }

    // fallback padrão
    const data = new Date(dataString);
    return isNaN(data) ? null : data;
}

      //estatisticas dos messes em comparação
      extratos.forEach(item => {
    const dataObj = parseData(item.created_at);

    if (!dataObj) return;

    let mes = dataObj.toLocaleString("pt-BR", {
        month: "short",
        year: "numeric"
    }).replace(".", "").toLowerCase();

    if (!dadosPorMes[mes]) {
        dadosPorMes[mes] = {
            mes,
            entradas: 0,
            saidas: 0
        };
    }

    if (item.tipo === "entrada") {
        dadosPorMes[mes].entradas += Number(item.valor);
    } else {
        dadosPorMes[mes].saidas += Number(item.valor);
    }
    });

      const dadosGraficoMes = Object.values(dadosPorMes)

      const ordemMeses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"]

   dadosGraficoMes.sort((a, b) => {
    const [mesA, anoA] = a.mes.split(" ");
    const [mesB, anoB] = b.mes.split(" ");

    if (anoA !== anoB) return Number(anoA) - Number(anoB);

    return ordemMeses.indexOf(mesA) - ordemMeses.indexOf(mesB);
});

    return(
        <div className="estatisticas-page">
            <NavBar />

            <h1 className="titulo">Estatísticas da conta</h1>

            <div className="cards-estatisticas">

            </div>

            <div className="graficos-container">

                <div className="grafico-box">
                     <h3>Estatíticas de entrada e saída dos messes</h3>
                    <BarChart width={350} height={300} data={dadosGraficoMes}>
                        
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="mes" />
                        <YAxis />
                        <Tooltip />

                        <Bar dataKey="entradas" fill="#2ecc71"/>
                        <Bar dataKey="saidas" fill="#e74c3c"/>

                    </BarChart>
                </div>
  
                <div className="grafico-box">
                    <h3>Estatíticas de entrada e saída do mês</h3>
                    <PieChart width={350} height={300}>

                        <Pie 
                            dataKey="valor"
                            data={dadosFormatados}
                            nameKey="tipo"
                            cx="50%"
                            cy="50%"
                            outerRadius={110}
                            label
                        >
                            {dadosFormatados.map((item, index) => (
                                <Cell key={index} fill={cores[index % cores.length]} />
                            ))}
                        </Pie>

                        <Tooltip />
                    </PieChart>
                </div>

            </div>
        </div>
    )
}