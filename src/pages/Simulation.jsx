import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Navbar from "../components/Navbar";
import Botao from "../components/Botao";
import Input from "../components/Input";

export default function Simulation() {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [nomeSimulacao, setNomeSimulacao] = useState("COVID-19 Cenário Base");
    const [populacaoTotal, setPopulacaoTotal] = useState("100000");
    const [infectadosIniciais, setInfectadosIniciais] = useState("10");
    const [taxaTransmissao, setTaxaTransmissao] = useState("0.5");
    const [taxaRecuperacao, setTaxaRecuperacao] = useState("0.1");
    const [taxaMortalidade, setTaxaMortalidade] = useState("0.02");
    const [duracao, setDuracao] = useState("365");
    const [resultado, setResultado] = useState(null);
    const [dadosGrafico, setDadosGrafico] = useState([]);
    
    // Proteção de rota - redireciona para login se não estiver autenticado
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);
    
    // Carrega a simulação se vier do histórico
    useEffect(() => {
        if (location.state?.simulacao) {
            const sim = location.state.simulacao;
            // Mostra os resultados da simulação guardada
            setResultado(sim);
            // Recria o gráfico com base nos dados guardados
            recriarGrafico(sim);
        }
    }, [location]);
    
    function recriarGrafico(simulacao) {
        // Usa os dados do gráfico que foram guardados
        if (simulacao.dadosGrafico && simulacao.dadosGrafico.length > 0) {
            setDadosGrafico(simulacao.dadosGrafico);
        } else {
            // Se não tiver dados do gráfico guardados, recria baseado nos parâmetros padrão
            // Isto acontece com simulações antigas feitas antes da funcionalidade do gráfico
            const graficoDados = [];
            const N = simulacao.populacaoTotal || 100000;
            const I0 = 10;
            const beta = 0.5;
            const gamma = 0.1;
            const mu = 0.02;
            const dias = simulacao.duracao || 365;
            
            let S = N - I0;
            let I = I0;
            let R = 0;
            let D = 0;
            
            // Estado inicial
            graficoDados.push({
                dia: 0,
                Suscetíveis: Math.round(S),
                Infectados: Math.round(I),
                Recuperados: 0,
                Óbitos: 0
            });
            
            const dt = 0.1;
            const passosPorDia = Math.round(1 / dt);
            
            for (let dia = 1; dia <= dias; dia++) {
                for (let substep = 0; substep < passosPorDia; substep++) {
                    const novosInfectados = (beta * S * I / N) * dt;
                    const novosRecuperados = gamma * I * (1 - mu) * dt;
                    const novosMortos = gamma * I * mu * dt;

                    S = Math.max(0, S - novosInfectados);
                    I = Math.max(0, I + novosInfectados - novosRecuperados - novosMortos);
                    R = R + novosRecuperados;
                    D = D + novosMortos;
                }
                
                graficoDados.push({
                    dia: dia,
                    Suscetíveis: Math.round(S),
                    Infectados: Math.round(I),
                    Recuperados: Math.round(R),
                    Óbitos: Math.round(D)
                });

                if (I < 0.5) break;
            }
            
            setDadosGrafico(graficoDados);
        }
    }

    function handleSimular(e) {
        e.preventDefault();

        // Converte os valores para números
        const N = parseFloat(populacaoTotal);
        const I0 = parseFloat(infectadosIniciais);
        const beta = parseFloat(taxaTransmissao);
        const gamma = parseFloat(taxaRecuperacao);
        const mu = parseFloat(taxaMortalidade);
        const dias = parseInt(duracao);
        
        // Validação dos parâmetros
        if (N <= 0 || I0 <= 0 || I0 > N || beta <= 0 || gamma <= 0 || mu < 0 || mu > 1 || dias <= 0) {
            alert("Por favor, insira valores válidos para os parâmetros.\n\nDicas:\n- População e Infectados devem ser > 0\n- Infectados iniciais ≤ População\n- Taxas de transmissão e recuperação > 0\n- Taxa de mortalidade entre 0 e 1\n- Duração > 0");
            return;
        }

        // Simulação simplificada baseada nos parâmetros
        const S0 = N - I0; // Suscetíveis iniciais
        let S = S0;
        let I = I0;
        let R = 0; // Recuperados
        let D = 0; // Mortos
        
        let picoInfectados = I;
        let diaPico = 0;
        
        // Array para guardar dados do gráfico
        const graficoDados = [];
        
        // Adiciona o estado inicial (dia 0)
        graficoDados.push({
            dia: 0,
            Suscetíveis: Math.round(S),
            Infectados: Math.round(I),
            Recuperados: 0,
            Óbitos: 0
        });

        // Simula dia a dia com passo de tempo adaptativo para estabilidade
        const dt = 0.1; // Passo de tempo fracionário para maior precisão
        const passosPorDia = Math.round(1 / dt);
        
        for (let dia = 1; dia <= dias; dia++) {
            // Simula vários sub-passos para cada dia
            for (let substep = 0; substep < passosPorDia; substep++) {
                const novosInfectados = (beta * S * I / N) * dt;
                const novosRecuperados = gamma * I * (1 - mu) * dt;
                const novosMortos = gamma * I * mu * dt;

                S = Math.max(0, S - novosInfectados);
                I = Math.max(0, I + novosInfectados - novosRecuperados - novosMortos);
                R = R + novosRecuperados;
                D = D + novosMortos;
            }
            
            // Guarda os dados para o gráfico (uma vez por dia)
            graficoDados.push({
                dia: dia,
                Suscetíveis: Math.round(S),
                Infectados: Math.round(I),
                Recuperados: Math.round(R),
                Óbitos: Math.round(D)
            });

            // Regista o pico de infectados
            if (I > picoInfectados) {
                picoInfectados = I;
                diaPico = dia;
            }

            // Para se não houver mais infectados
            if (I < 0.5) break;
        }

        const resultadoFinal = {
            id: Date.now(), // ID único baseado no timestamp
            nome: nomeSimulacao,
            data: new Date().toLocaleDateString("pt-PT"),
            obitos: Math.round(D),
            pico: Math.round(picoInfectados),
            diaPico: diaPico,
            recuperados: Math.round(R),
            suscetiveisFinais: Math.round(S),
            duracao: dias,
            populacaoTotal: N,
            utilizador: user?.email || "utilizador@exemplo.com", // Guarda o email do utilizador
            dadosGrafico: graficoDados // Guarda também os dados do gráfico
        };

        // Guarda a simulação no localStorage
        const simulacoesGuardadas = JSON.parse(localStorage.getItem('simulacoes') || '[]');
        simulacoesGuardadas.push(resultadoFinal);
        localStorage.setItem('simulacoes', JSON.stringify(simulacoesGuardadas));

        setResultado(resultadoFinal);
        setDadosGrafico(graficoDados); // Guarda os dados do gráfico
        console.log("Simulação executada e guardada:", resultadoFinal);
        alert("Simulação executada e guardada com sucesso!");
    }

    // Nome do utilizador com primeira letra maiúscula
    const userName = user?.nome ? user.nome.charAt(0).toUpperCase() + user.nome.slice(1) : "Utilizador";

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#F3F8F6" }}>
            <Navbar nome={userName} />

            {/* Conteúdo Principal */}
            <div
            style={{
                minHeight: "calc(100vh - 80px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px 20px",
            }}
        >
            <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                width: '100%',
                maxWidth: '800px',
            }}>
                <h1 style={{ color: "#63b099", marginBottom: "30px", textAlign: "center" }}>Parâmetros da Simulação</h1>

                <form onSubmit={handleSimular}>
                    <Input
                        label="Nome da Simulação"
                        type="text"
                        placeholder="Ex: COVID-19 Cenário Base"
                        value={nomeSimulacao}
                        onChange={(e) => setNomeSimulacao(e.target.value)}
                    />

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                        <Input
                            label="População Total"
                            type="number"
                            placeholder="100000"
                            value={populacaoTotal}
                            onChange={(e) => setPopulacaoTotal(e.target.value)}
                        />
                        <Input
                            label="Infectados Iniciais"
                            type="number"
                            placeholder="10"
                            value={infectadosIniciais}
                            onChange={(e) => setInfectadosIniciais(e.target.value)}
                        />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px" }}>
                        <Input
                            label="Taxa de Transmissão"
                            type="number"
                            step="0.01"
                            placeholder="0,5"
                            value={taxaTransmissao}
                            onChange={(e) => setTaxaTransmissao(e.target.value)}
                        />
                        <Input
                            label="Taxa de Recuperação"
                            type="number"
                            step="0.01"
                            placeholder="0,1"
                            value={taxaRecuperacao}
                            onChange={(e) => setTaxaRecuperacao(e.target.value)}
                        />
                        <Input
                            label="Taxa de Mortalidade"
                            type="number"
                            step="0.01"
                            placeholder="0,02"
                            value={taxaMortalidade}
                            onChange={(e) => setTaxaMortalidade(e.target.value)}
                        />
                    </div>

                    <Input
                        label="Duração da Simulação (dias)"
                        type="number"
                        placeholder="365"
                        value={duracao}
                        onChange={(e) => setDuracao(e.target.value)}
                    />

                    <Botao texto="▶ Executar Simulação" tipo="submit" />
                </form>

                {resultado && (
                    <>
                        {/* Cards de Estatísticas */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "15px", marginTop: "30px" }}>
                            {/* Card 1 - Pico de Infectados */}
                            <div style={{
                                backgroundColor: "#ffe5e5",
                                padding: "20px",
                                borderRadius: "10px",
                                textAlign: "center"
                            }}>
                                <div style={{ fontSize: "20px", marginBottom: "5px" }}>📈</div>
                                <div style={{ fontSize: "28px", fontWeight: "bold", color: "#e74c3c", marginBottom: "5px" }}>
                                    {resultado.pico.toLocaleString()}
                                </div>
                                <div style={{ fontSize: "12px", color: "#666", fontWeight: "500", marginBottom: "3px" }}>
                                    Pico de Infectados
                                </div>
                                <div style={{ fontSize: "11px", color: "#999" }}>
                                    {((resultado.pico / resultado.populacaoTotal) * 100).toFixed(2)}% da população
                                </div>
                            </div>

                            {/* Card 2 - Total de Óbitos */}
                            <div style={{
                                backgroundColor: "#fff4e5",
                                padding: "20px",
                                borderRadius: "10px",
                                textAlign: "center"
                            }}>
                                <div style={{ fontSize: "20px", marginBottom: "5px" }}>⚠️</div>
                                <div style={{ fontSize: "28px", fontWeight: "bold", color: "#f39c12", marginBottom: "5px" }}>
                                    {resultado.obitos.toLocaleString()}
                                </div>
                                <div style={{ fontSize: "12px", color: "#666", fontWeight: "500", marginBottom: "3px" }}>
                                    Total de Óbitos
                                </div>
                                <div style={{ fontSize: "11px", color: "#999" }}>
                                    {((resultado.obitos / resultado.populacaoTotal) * 100).toFixed(2)}% da população
                                </div>
                            </div>

                            {/* Card 3 - Duração da Epidemia */}
                            <div style={{
                                backgroundColor: "#e5f3ff",
                                padding: "20px",
                                borderRadius: "10px",
                                textAlign: "center"
                            }}>
                                <div style={{ fontSize: "20px", marginBottom: "5px" }}>📅</div>
                                <div style={{ fontSize: "28px", fontWeight: "bold", color: "#3498db", marginBottom: "5px" }}>
                                    {resultado.duracao} dias
                                </div>
                                <div style={{ fontSize: "12px", color: "#666", fontWeight: "500", marginBottom: "3px" }}>
                                    Duração da Epidemia
                                </div>
                                <div style={{ fontSize: "11px", color: "#999" }}>
                                    {Math.round(resultado.duracao / 30)} meses
                                </div>
                            </div>

                            {/* Card 4 - População Total */}
                            <div style={{
                                backgroundColor: "#e5f9f3",
                                padding: "20px",
                                borderRadius: "10px",
                                textAlign: "center"
                            }}>
                                <div style={{ fontSize: "20px", marginBottom: "5px" }}>👥</div>
                                <div style={{ fontSize: "28px", fontWeight: "bold", color: "#63b099", marginBottom: "5px" }}>
                                    {resultado.populacaoTotal.toLocaleString()}
                                </div>
                                <div style={{ fontSize: "12px", color: "#666", fontWeight: "500", marginBottom: "3px" }}>
                                    População Total
                                </div>
                                <div style={{ fontSize: "11px", color: "#999" }}>
                                    habitantes
                                </div>
                            </div>
                        </div>

                        {/* Gráfico */}
                        <div style={{
                            marginTop: "30px",
                            padding: "25px",
                            backgroundColor: "#f9f9f9",
                            borderRadius: "10px"
                        }}>
                            <h3 style={{ color: "#63b099", marginBottom: "20px", textAlign: "center" }}>Evolução da Epidemia</h3>
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={dadosGrafico} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                    <XAxis 
                                        dataKey="dia" 
                                        label={{ value: 'Dias', position: 'insideBottom', offset: -5 }} 
                                    />
                                    <YAxis label={{ value: 'População', angle: -90, position: 'insideLeft' }} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px' }}
                                    />
                                    <Legend />
                                    <Line type="monotone" dataKey="Infectados" stroke="#FF6B6B" strokeWidth={3} dot={false} />
                                    <Line type="monotone" dataKey="Recuperados" stroke="#4ECDC4" strokeWidth={3} dot={false} />
                                    <Line type="monotone" dataKey="Suscetíveis" stroke="#95E1D3" strokeWidth={3} dot={false} />
                                    <Line type="monotone" dataKey="Óbitos" stroke="#F38181" strokeWidth={3} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </>
                )}
            </div>
        </div>
        </div>
    );
}
