import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { useWindowSize } from "../hooks/useWindowSize";
import Toast from "../components/Toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Navbar from "../components/Navbar";
import Button from "../components/common/Button";
import Input from "../components/common/Input";

/**
 * Página de Simulação Epidemiológica (Modelo SIRD)
 * 
 * Funcionalidades:
 * - Simulação matemática de propagação de doenças usando modelo SIRD
 * - Modelo SIRD: S (Suscetíveis), I (Infetados), R (Recuperados), D (Óbitos)
 * - Formulário de parâmetros epidemiológicos
 * - Cálculo de resultados: pico de infeção, total de óbitos, taxa de mortalidade
 * - Gráfico interativo com Recharts mostrando evolução temporal
 * - Modo visualização: carrega simulação do histórico
 * - Modo criação: nova simulação com parâmetros personalizados
 * - Guardar simulação em localStorage
 * - Design totalmente responsivo
 * 
 * Algoritmo SIRD (Equações Diferenciais):
 * dS/dt = -β * S * I / N              (Novos infetados)
 * dI/dt = β * S * I / N - γ * I - μ * I  (Infetados ativos: novos - recuperados - óbitos)
 * dR/dt = γ * I                         (Novos recuperados)
 * dD/dt = μ * I                         (Novos óbitos)
 * 
 * Parâmetros:
 * - N: População total
 * - β (beta): Taxa de transmissão (contactos efetivos por dia)
 * - γ (gamma): Taxa de recuperação (1/período infecioso)
 * - μ (mu): Taxa de mortalidade (fração de infetados que morrem)
 * - dt: Passo de tempo (0.1 dia para maior precisão)
 * 
 * Fluxo:
 * 1. Verifica autenticação
 * 2. Se vem do histórico: carrega simulação existente e recria gráfico
 * 3. Se novo: preenche formulário com parâmetros
 * 4. Ao submeter: executa algoritmo SIRD, calcula resultados, gera gráfico
 * 5. Permite guardar simulação em localStorage
 */
export default function Simulation() {
    // Contexto e hooks
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const { toast, showToast, hideToast } = useToast();
    const { width: windowWidth } = useWindowSize();
    
    // Estados do formulário de parâmetros
    const [nomeSimulacao, setNomeSimulacao] = useState("");
    const [populacaoTotal, setPopulacaoTotal] = useState("");
    const [infetadosIniciais, setInfetadosIniciais] = useState("");
    const [taxaTransmissao, setTaxaTransmissao] = useState("");
    const [taxaRecuperacao, setTaxaRecuperacao] = useState("");
    const [taxaMortalidade, setTaxaMortalidade] = useState("");
    const [duracao, setDuracao] = useState("");
    
    // Estados de resultados
    const [resultado, setResultado] = useState(null); // Objeto com pico, óbitos, etc.
    const [dadosGrafico, setDadosGrafico] = useState([]); // Array de pontos para Recharts
    
    // Verifica se está em modo visualização (vindo do histórico via navigate state)
    const modoVisualizacao = location.state?.simulacao ? true : false;
    
    // Proteção de rota - redireciona para login se não estiver autenticado
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);
    
    /**
     * Carrega simulação se vier do histórico
     * Quando utilizador clica em "Ver Detalhes" no histórico,
     * navega com state contendo a simulação completa
     */
    useEffect(() => {
        if (location.state?.simulacao) {
            const sim = location.state.simulacao;
            // Mostra os resultados da simulação guardada
            setResultado(sim);
            // Recria o gráfico com base nos dados guardados
            recriarGrafico(sim);
        }
    }, [location]);
    
    /**
     * Recria o gráfico a partir de uma simulação guardada
     * 
     * Dois cenários:
     * 1. Simulação tem dadosGrafico guardados: usa diretamente
     * 2. Simulação antiga sem dadosGrafico: executa algoritmo SIRD novamente com parâmetros padrão
     */
    function recriarGrafico(simulacao) {
        // Usa os dados do gráfico que foram guardados
        if (simulacao.dadosGrafico && simulacao.dadosGrafico.length > 0) {
            setDadosGrafico(simulacao.dadosGrafico);
        } else {
            // Simulações antigas: recria baseado nos parâmetros padrão
            // Isto acontece com simulações feitas antes da funcionalidade do gráfico ser implementada
            const graficoDados = [];
            const N = simulacao.populacaoTotal || 100000;
            const I0 = 10; // Valor padrão
            const beta = 0.5; // Valor padrão
            const gamma = 0.1; // Valor padrão
            const mu = 0.02; // Valor padrão
            const dias = simulacao.duracao || 365;
            
            // Condições iniciais do modelo SIRD
            let S = N - I0; // Suscetíveis = população total - infetados iniciais
            let I = I0; // Infetados iniciais
            let R = 0; // Nenhum recuperado ainda
            let D = 0; // Nenhum óbito ainda
            
            // Estado inicial (dia 0)
            graficoDados.push({
                dia: 0,
                Suscetíveis: Math.round(S),
                Infetados: Math.round(I),
                Recuperados: 0,
                Óbitos: 0
            });
            
            // Configuração do algoritmo numérico
            const dt = 0.1; // Passo de tempo: 0.1 dia (maior precisão)
            const passosPorDia = Math.round(1 / dt); // 10 passos por dia
            
            // Loop principal da simulação: itera por cada dia
            for (let dia = 1; dia <= dias; dia++) {
                // Sub-passos dentro de cada dia para maior precisão (10 passos de 0.1 dia)
                for (let substep = 0; substep < passosPorDia; substep++) {
                    /**
                     * Equações diferenciais do modelo SIRD (método de Euler)
                    /**
                     * dS/dt = -β * S * I / N
                     * Taxa de novos infetados = contactos * prob. de encontro com infetado
                     */
                    const novosInfetados = (beta * S * I / N) * dt;
                    
                    /**
                     * dR/dt = γ * I * (1 - μ)
                     * Taxa de recuperação = fração de infetados que recupera (não morre)
                     */
                    const novosRecuperados = gamma * I * (1 - mu) * dt;
                    
                    /**
                     * dD/dt = γ * I * μ
                     * Taxa de óbitos = fração de infetados que morre
                     */
                    const novosMortos = gamma * I * mu * dt;

                    // Atualiza compartimentos do modelo (garante valores não-negativos)
                    S = Math.max(0, S - novosInfetados); // Suscetíveis diminuem
                    I = Math.max(0, I + novosInfetados - novosRecuperados - novosMortos); // Infetados: entram novos, saem recuperados e mortos
                    R = R + novosRecuperados; // Recuperados aumentam
                    D = D + novosMortos; // Óbitos aumentam
                }
                
                // Guarda ponto do gráfico (um por dia, após todos os sub-passos)
                graficoDados.push({
                    dia: dia,
                    Suscetíveis: Math.round(S),
                    Infetados: Math.round(I),
                    Recuperados: Math.round(R),
                    Óbitos: Math.round(D)
                });
            }
            
            setDadosGrafico(graficoDados);
        }
    }

    /**
     * Manipula o submit do formulário de simulação
     * 
     * Processo:
     * 1. Validação de campos
     * 2. Conversão de strings para números
     * 3. Validação de intervalos dos parâmetros
     * 4. Execução do algoritmo SIRD
     * 5. Cálculo de estatísticas (pico, óbitos totais, taxa)
     * 6. Geração de dados para o gráfico
     * 7. Atualização do estado com resultados
     */
    function handleSimular(e) {
        e.preventDefault();

        // Validação 1: Nome da simulação não pode estar vazio
        if (!nomeSimulacao.trim()) {
            showToast("Por favor, insira um nome para a simulação.", "error");
            return;
        }

        // Validação 2: Todos os parâmetros devem estar preenchidos
        if (!populacaoTotal || !infetadosIniciais || !taxaTransmissao || !taxaRecuperacao || !taxaMortalidade || !duracao) {
            showToast("Por favor, preencha todos os campos antes de simular.", "error");
            return;
        }

        // Conversão de strings para números
        const N = parseFloat(populacaoTotal); // População total
        const I0 = parseFloat(infetadosIniciais); // Infetados iniciais
        const beta = parseFloat(taxaTransmissao); // Taxa de transmissão (β)
        const gamma = parseFloat(taxaRecuperacao); // Taxa de recuperação (γ)
        const mu = parseFloat(taxaMortalidade); // Taxa de mortalidade (μ)
        const dias = parseInt(duracao); // Duração da simulação em dias
        
        // Validação 3: Intervalos válidos dos parâmetros
        if (N <= 0 || I0 <= 0 || I0 > N || beta <= 0 || gamma <= 0 || mu < 0 || mu > 1 || dias <= 0) {
            showToast("Por favor, insira valores válidos para os parâmetros.", "error");
            return;
        }

        // Inicialização do modelo SIRD
        const S0 = N - I0; // Suscetíveis iniciais = população total - infetados iniciais
        let S = S0; // Suscetíveis
        let I = I0; // Infetados
        let R = 0; // Recuperados
        let D = 0; // Óbitos
        
        // Variáveis para rastreamento de estatísticas
        let picoInfetados = I; // Maior número de infetados simultâneos
        let diaPico = 0; // Dia em que ocorreu o pico
        
        // Array para guardar dados do gráfico (um ponto por dia)
        const graficoDados = [];
        
        // Estado inicial (dia 0)
        graficoDados.push({
            dia: 0,
            Suscetíveis: Math.round(S),
            Infetados: Math.round(I),
            Recuperados: 0,
            Óbitos: 0
        });

        // Configuração do método numérico (Euler)
        const dt = 0.1; // Passo de tempo: 0.1 dia (10 iterações por dia)
        const passosPorDia = Math.round(1 / dt);
        
        // Loop principal: simulação dia a dia
        for (let dia = 1; dia <= dias; dia++) {
            // Sub-passos para cada dia (maior precisão numérica)
            for (let substep = 0; substep < passosPorDia; substep++) {
                // Cálculo das taxas de mudança (equações SIRD)
                const novosInfetados = (beta * S * I / N) * dt;
                const novosRecuperados = gamma * I * (1 - mu) * dt;
                const novosMortos = gamma * I * mu * dt;

                // Atualiza compartimentos (garante não-negatividade)
                S = Math.max(0, S - novosInfetados);
                I = Math.max(0, I + novosInfetados - novosRecuperados - novosMortos);
                R = R + novosRecuperados;
                D = D + novosMortos;
            }
            
            // Guarda dados para o gráfico (um ponto por dia completo)
            graficoDados.push({
                dia: dia,
                Suscetíveis: Math.round(S),
                Infetados: Math.round(I),
                Recuperados: Math.round(R),
                Óbitos: Math.round(D)
            });

            // Rastreia o pico de infetados (para estatísticas)
            if (I > picoInfetados) {
                picoInfetados = I;
                diaPico = dia;
            }
        }

        // Criação do objeto de resultado com todas as estatísticas
        const resultadoFinal = {
            id: Date.now(), // ID único baseado no timestamp (milissegundos)
            nome: nomeSimulacao,
            data: new Date().toLocaleDateString("pt-PT"), // Data de criação (formato PT)
            obitos: Math.round(D), // Total de óbitos ao final da simulação
            pico: Math.round(picoInfetados), // Pico máximo de infetados simultâneos
            diaPico: diaPico, // Dia em que ocorreu o pico
            recuperados: Math.round(R), // Total de recuperados ao final
            suscetiveisFinais: Math.round(S), // Suscetíveis restantes
            duracao: dias, // Duração em dias
            populacaoTotal: N, // População total
            utilizador: user?.email || "utilizador@exemplo.com", // Email do utilizador que criou
            dadosGrafico: graficoDados // Array de pontos para reconstruir gráfico
        };

        // Persistência: guarda a simulação no localStorage
        const simulacoesGuardadas = JSON.parse(localStorage.getItem('simulacoes') || '[]');
        simulacoesGuardadas.push(resultadoFinal);
        localStorage.setItem('simulacoes', JSON.stringify(simulacoesGuardadas));

        // Atualiza estado para exibir resultados
        setResultado(resultadoFinal);
        setDadosGrafico(graficoDados);
        
        console.log("Simulação executada e guardada:", resultadoFinal);
        showToast("Simulação executada com sucesso!", "success");
    }

    // Nome do utilizador com primeira letra maiúscula (para exibição)
    const userName = user?.nome ? user.nome.charAt(0).toUpperCase() + user.nome.slice(1) : "Utilizador";

    /**
     * Modo Visualização: exibe apenas resultados de simulação existente
     * Ativado quando vem do histórico (location.state.simulacao existe)
     */
    if (modoVisualizacao && resultado) {
        return (
            /* Container de visualização - apenas leitura */
            <div style={{ minHeight: "100vh", backgroundColor: "#F3F8F6", paddingTop: "90px" }}>
                <Navbar nome={userName} />
                
                <div style={{ padding: "40px 20px" }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: windowWidth <= 480 ? '20px' : '40px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                        maxWidth: '1200px',
                        margin: '0 auto'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                            <h1 style={{ color: "#63b099", margin: 0 }}>Detalhes da Simulação: {resultado.nome}</h1>
                            <button 
                                onClick={() => navigate('/historico')}
                                style={{
                                    backgroundColor: '#63b099',
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                ← Voltar ao Histórico
                            </button>
                        </div>

                        {/* Resultados */}
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: windowWidth <= 480 ? "1fr" : windowWidth <= 768 ? "repeat(2, 1fr)" : "repeat(auto-fit, minmax(200px, 1fr))",
                            gap: "20px",
                            marginBottom: "30px"
                        }}>
                            <div style={{ backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "8px" }}>
                                <h3 style={{ color: "#63b099", margin: "0 0 10px 0" }}>Pico de Infecções</h3>
                                <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>{resultado.pico.toLocaleString()}</p>
                                <p style={{ color: "#666", margin: "5px 0 0 0" }}>Dia {resultado.diaPico}</p>
                            </div>
                            <div style={{ backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "8px" }}>
                                <h3 style={{ color: "#63b099", margin: "0 0 10px 0" }}>Total de Óbitos</h3>
                                <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>{resultado.obitos.toLocaleString()}</p>
                            </div>
                            <div style={{ backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "8px" }}>
                                <h3 style={{ color: "#63b099", margin: "0 0 10px 0" }}>Recuperados</h3>
                                <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>{resultado.recuperados.toLocaleString()}</p>
                            </div>
                            <div style={{ backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "8px" }}>
                                <h3 style={{ color: "#63b099", margin: "0 0 10px 0" }}>Suscetíveis Finais</h3>
                                <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>{resultado.suscetiveisFinais.toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Gráfico */}
                        <div style={{ marginTop: "40px" }}>
                            <h3 style={{ color: "#63b099", marginBottom: "20px", textAlign: "center" }}>Evolução da Epidemia</h3>
                            <ResponsiveContainer width="100%" height={windowWidth <= 768 ? 300 : 400}>
                                <LineChart 
                                    data={dadosGrafico} 
                                    margin={{ 
                                        top: 5, 
                                        right: windowWidth <= 768 ? 10 : 30, 
                                        left: windowWidth <= 768 ? 20 : 80, 
                                        bottom: windowWidth <= 768 ? 60 : 80 
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                    <XAxis 
                                        dataKey="dia" 
                                        label={{ 
                                            value: 'Dias', 
                                            position: 'insideBottom', 
                                            offset: windowWidth <= 768 ? -10 : -15, 
                                            dx: -10, 
                                            style: { fontSize: windowWidth <= 768 ? '12px' : '16px', fontWeight: 'bold' } 
                                        }}
                                        interval={windowWidth <= 480 ? 49 : windowWidth <= 768 ? 39 : 24}
                                        tick={{ fontSize: windowWidth <= 768 ? '10px' : '12px' }}
                                    />
                                    <YAxis 
                                        label={{ 
                                            value: 'População', 
                                            angle: -90, 
                                            position: 'insideLeft', 
                                            dx: windowWidth <= 768 ? -5 : -15, 
                                            dy: 40, 
                                            style: { fontSize: windowWidth <= 768 ? '12px' : '16px', fontWeight: 'bold' } 
                                        }}
                                        tick={{ fontSize: windowWidth <= 768 ? '10px' : '12px' }}
                                    />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', fontSize: '12px' }}
                                    />
                                    <Legend 
                                        verticalAlign="bottom" 
                                        height={50} 
                                        wrapperStyle={{ 
                                            paddingTop: windowWidth <= 768 ? '20px' : '40px', 
                                            paddingLeft: windowWidth <= 768 ? '0px' : '50px',
                                            fontSize: windowWidth <= 768 ? '11px' : '14px'
                                        }}
                                        iconSize={windowWidth <= 768 ? 10 : 14}
                                    />
                                    <Line type="monotone" dataKey="Infetados" stroke="#e74c3c" strokeWidth={windowWidth <= 768 ? 2 : 2.5} dot={false} />
                                    <Line type="monotone" dataKey="Recuperados" stroke="#2ecc71" strokeWidth={windowWidth <= 768 ? 2 : 2.5} dot={false} />
                                    <Line type="monotone" dataKey="Suscetíveis" stroke="#3498db" strokeWidth={windowWidth <= 768 ? 2 : 2.5} strokeDasharray="5 5" dot={false} />
                                    <Line type="monotone" dataKey="Óbitos" stroke="#34495e" strokeWidth={windowWidth <= 768 ? 2 : 2.5} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#F3F8F6", paddingTop: "90px" }}>
            <Navbar nome={userName} />

            {/* Header Section */}
            <div style={{ 
                maxWidth: '1800px', 
                margin: '0 auto', 
                padding: '32px 24px 0 24px' 
            }}>
                <div style={{ marginBottom: '32px' }}>
                    <h2 style={{ 
                        color: '#63b099', 
                        margin: '0 0 8px 0',
                        fontSize: '32px',
                        fontWeight: '600'
                    }}>
                        Olá, {userName}!
                    </h2>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '15px' }}>
                        Execute simulações e analise cenários epidemiológicos
                    </p>
                </div>
            </div>

            {/* Conteúdo Principal - Grid 2 Colunas */}
            <div style={{
                maxWidth: '1800px',
                margin: '0 auto',
                padding: '0 24px 40px 24px',
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: windowWidth <= 768 ? '1fr' : '400px 1fr',
                    gap: '32px',
                    alignItems: 'start'
                }}>
                    {/* Coluna Esquerda - Formulário */}
                    <div style={{
                        backgroundColor: 'white',
                        padding: windowWidth <= 480 ? '20px' : '32px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                    }}>
                        <h3 style={{ 
                            color: "#63b099", 
                            marginBottom: "24px", 
                            fontSize: '20px',
                            fontWeight: '600'
                        }}>
                            Parâmetros da Simulação
                        </h3>

                        <form onSubmit={handleSimular} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <Input
                                label="Nome da Simulação"
                                type="text"
                                placeholder="Ex: COVID-19 Cenário Base"
                                value={nomeSimulacao}
                                onChange={(e) => setNomeSimulacao(e.target.value)}
                            />

                            <div style={{ display: "grid", gridTemplateColumns: windowWidth <= 480 ? "1fr" : "1fr 1fr", gap: "20px" }}>
                                <Input
                                    label="População Total"
                                    type="number"
                                    placeholder="100000"
                                    value={populacaoTotal}
                                    onChange={(e) => setPopulacaoTotal(e.target.value)}
                                />
                                <Input
                                    label="Infetados Iniciais"
                                    type="number"
                                    placeholder="10"
                                    value={infetadosIniciais}
                                    onChange={(e) => setInfetadosIniciais(e.target.value)}
                                />
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px" }}>
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

                            <Button type="submit" variant="primary" fullWidth>
                                ▶ Executar Simulação
                            </Button>
                        </form>
                    </div>

                    {/* Coluna Direita - Resultados */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {resultado ? (
                            <>
                                {/* Info da Simulação */}
                                <div style={{
                                    backgroundColor: 'white',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                                    padding: '24px'
                                }}>
                                    <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        flexWrap: 'wrap',
                                        gap: '12px'
                                    }}>
                                        <h2 style={{ 
                                            color: '#63b099', 
                                            margin: 0,
                                            fontSize: '22px',
                                            fontWeight: '600'
                                        }}>
                                            {resultado.nome}
                                        </h2>
                                        <span style={{ color: '#64748b', fontSize: '14px' }}>
                                            {new Date(resultado.data).toLocaleString('pt-PT')}
                                        </span>
                                    </div>
                                </div>
                        {/* Cards de Estatísticas */}
                        <div style={{ 
                            display: "grid", 
                            gridTemplateColumns: windowWidth <= 480 ? "1fr" : windowWidth <= 768 ? "repeat(2, 1fr)" : "repeat(4, 1fr)", 
                            gap: "15px", 
                            marginTop: "30px" 
                        }}>
                            {/* Card 1 - Pico de Infetados */}
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
                                    Pico de Infetados
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
                            padding: "25px",
                            backgroundColor: "#f9f9f9",
                            borderRadius: "10px"
                        }}>
                            <h3 style={{ color: "#63b099", marginBottom: "20px", textAlign: "center" }}>Evolução da Epidemia</h3>
                            <ResponsiveContainer width="100%" height={windowWidth <= 768 ? 300 : 400}>
                                <LineChart 
                                    data={dadosGrafico} 
                                    margin={{ 
                                        top: 5, 
                                        right: windowWidth <= 768 ? 10 : 30, 
                                        left: windowWidth <= 768 ? 20 : 80, 
                                        bottom: windowWidth <= 768 ? 60 : 80 
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                    <XAxis 
                                        dataKey="dia" 
                                        label={{ 
                                            value: 'Dias', 
                                            position: 'insideBottom', 
                                            offset: windowWidth <= 768 ? -10 : -15, 
                                            dx: -10, 
                                            style: { fontSize: windowWidth <= 768 ? '12px' : '16px', fontWeight: 'bold' } 
                                        }}
                                        interval={windowWidth <= 480 ? 49 : windowWidth <= 768 ? 39 : 24}
                                        tick={{ fontSize: windowWidth <= 768 ? '10px' : '12px' }}
                                    />
                                    <YAxis 
                                        label={{ 
                                            value: 'População', 
                                            angle: -90, 
                                            position: 'insideLeft', 
                                            dx: windowWidth <= 768 ? -5 : -15, 
                                            dy: 40, 
                                            style: { fontSize: windowWidth <= 768 ? '12px' : '16px', fontWeight: 'bold' } 
                                        }}
                                        tick={{ fontSize: windowWidth <= 768 ? '10px' : '12px' }}
                                    />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', fontSize: '12px' }}
                                    />
                                    <Legend 
                                        verticalAlign="bottom" 
                                        height={50} 
                                        wrapperStyle={{ 
                                            paddingTop: windowWidth <= 768 ? '20px' : '40px', 
                                            paddingLeft: windowWidth <= 768 ? '0px' : '50px',
                                            fontSize: windowWidth <= 768 ? '11px' : '14px'
                                        }}
                                        iconSize={windowWidth <= 768 ? 10 : 14}
                                    />
                                    <Line type="monotone" dataKey="Infetados" stroke="#e74c3c" strokeWidth={windowWidth <= 768 ? 2 : 2.5} dot={false} />
                                    <Line type="monotone" dataKey="Recuperados" stroke="#2ecc71" strokeWidth={windowWidth <= 768 ? 2 : 2.5} dot={false} />
                                    <Line type="monotone" dataKey="Suscetíveis" stroke="#3498db" strokeWidth={windowWidth <= 768 ? 2 : 2.5} strokeDasharray="5 5" dot={false} />
                                    <Line type="monotone" dataKey="Óbitos" stroke="#34495e" strokeWidth={windowWidth <= 768 ? 2 : 2.5} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                            </>
                        ) : (
                            <div style={{
                                backgroundColor: 'white',
                                borderRadius: '12px',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                                padding: '80px 40px',
                                textAlign: 'center'
                            }}>
                                <h3 style={{ 
                                    color: '#334155', 
                                    marginBottom: '12px',
                                    fontSize: '22px',
                                    fontWeight: '600'
                                }}>
                                    Nenhuma simulação ativa
                                </h3>
                                <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>
                                    Configure os parâmetros e execute uma simulação para visualizar os resultados
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Toast de notificação */}
            {toast && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={hideToast} 
                />
            )}
        </div>
    );
}
