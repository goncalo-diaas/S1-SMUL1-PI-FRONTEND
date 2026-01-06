import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWindowSize } from "../hooks/useWindowSize";
import Navbar from "../components/Navbar";

/**
 * Página de Histórico de Simulações
 * 
 * Funcionalidades:
 * - Lista todas as simulações guardadas do utilizador atual
 * - Carrega dados do localStorage e filtra por email do utilizador
 * - Permite eliminar simulações
 * - Permite ver detalhes (redireciona para /simulacao com dados)
 * - Mostra estatísticas resumidas (total, este mês, média de óbitos)
 * - Design responsivo com grid adaptativo
 * - Proteção de rota (redireciona para login se não autenticado)
 * 
 * Fluxo:
 * 1. Verifica autenticação (useEffect)
 * 2. Carrega simulações do localStorage filtradas por utilizador
 * 3. Ordena por data (mais recente primeiro)
 * 4. Calcula estatísticas
 * 5. Exibe cards de estatísticas + lista de simulações
 * 6. Botões: Ver Detalhes (navega com state) / Eliminar (remove de state e localStorage)
 */
export default function History() {
    // Contexto e hooks
    const { user } = useAuth();
    const navigate = useNavigate();
    const { width: windowWidth } = useWindowSize();
    
    // Estado das simulações
    const [simulations, setSimulations] = useState([]);

    // Proteção de rota - redireciona para login se não estiver autenticado
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    // Carrega as simulações do localStorage quando o componente é montado
    useEffect(() => {
        if (user) {
            carregarSimulacoes();
        }
    }, [user]);

    /**
     * Carrega simulações do localStorage
     * - Filtra apenas simulações do utilizador atual (por email)
     * - Ordena da mais recente para a mais antiga (baseado no ID que é timestamp)
     */
    function carregarSimulacoes() {
        const simulacoesGuardadas = JSON.parse(localStorage.getItem('simulacoes') || '[]');
        // Filtra apenas as simulações do utilizador atual
        const simulacoesDoUtilizador = simulacoesGuardadas.filter(sim => sim.utilizador === user?.email);
        // Ordena da mais recente para a mais antiga (baseado no ID que é timestamp)
        simulacoesDoUtilizador.sort((a, b) => b.id - a.id);
        setSimulations(simulacoesDoUtilizador);
    }

    /**
     * Elimina uma simulação
     * - Remove do estado local (atualização imediata na UI)
     * - Remove do localStorage (persistência)
     */
    function handleDelete(id) {
        // Remove do estado local
        const filtered = simulations.filter(sim => sim.id !== id);
        setSimulations(filtered);
        
        // Remove do localStorage
        const todasSimulacoes = JSON.parse(localStorage.getItem('simulacoes') || '[]');
        const novasSimulacoes = todasSimulacoes.filter(sim => sim.id !== id);
        localStorage.setItem('simulacoes', JSON.stringify(novasSimulacoes));
    }
    
    /**
     * Navega para página de simulação com dados pré-carregados
     * Usa navigate state para passar dados da simulação
     */
    function handleVerDetalhes(simulacao) {
        navigate('/simulacao', { state: { simulacao } });
    }

    // Cálculo de estatísticas
    const totalSimulations = simulations.length; // Total de simulações
    const thisMonth = simulations.length; // TODO: filtrar apenas deste mês
    const avgDeaths = simulations.length > 0 
        ? Math.round(simulations.reduce((acc, sim) => acc + (sim.obitos || 0), 0) / simulations.length) 
        : 0; // Média de óbitos
    
    // Nome do utilizador com primeira letra maiúscula
    const userName = user?.nome ? user.nome.charAt(0).toUpperCase() + user.nome.slice(1) : "Administrador";

    return (
        /* Container principal com navbar fixa */
        <div style={{ minHeight: "100vh", backgroundColor: "#F3F8F6", paddingTop: "90px" }}>
            <Navbar nome={userName} />

            {/* Hero Section - cabeçalho da página com botão de voltar */}
            <div style={{
                backgroundColor: "#63b099",
                color: "white",
                padding: windowWidth <= 480 ? "24px 16px" : "40px",
                display: "flex",
                flexDirection: windowWidth <= 768 ? "column" : "row", // Coluna em mobile, linha em desktop
                gap: windowWidth <= 768 ? "16px" : "0",
                justifyContent: "space-between",
                alignItems: windowWidth <= 768 ? "flex-start" : "center"
            }}>
                <div>
                    <h2 style={{ margin: "0 0 8px 0", fontSize: windowWidth <= 480 ? "24px" : "32px" }}>
                        Histórico de Simulações
                    </h2>
                    <p style={{ margin: 0, fontSize: "15px", opacity: 0.9 }}>Aceda e faça a gestão das suas simulações anteriores</p>
                </div>
                {/* Botão de voltar ao simulador - fullwidth em mobile */}
                <Link 
                    to="/simulacao"
                    style={{
                        backgroundColor: "rgba(255,255,255,0.2)",
                        color: "white",
                        padding: "10px 20px",
                        borderRadius: "6px",
                        textDecoration: "none",
                        fontSize: "14px",
                        fontWeight: "500",
                        border: "1px solid rgba(255,255,255,0.3)",
                        width: windowWidth <= 768 ? "100%" : "auto",
                        textAlign: "center",
                        display: "block"
                    }}
                >
                    Voltar ao Simulador
                </Link>
            </div>

            {/* Secção de conteúdo principal */}
            <div style={{ padding: windowWidth <= 480 ? "20px 16px" : "40px", maxWidth: "1200px", margin: "0 auto" }}>
                {/* Cards de Estatísticas - grid responsivo (1 col mobile, 2 tablet, 3 desktop) */}
                <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: windowWidth <= 480 ? "1fr" : windowWidth <= 768 ? "repeat(2, 1fr)" : "1fr 1fr 1fr", 
                    gap: "20px", 
                    marginBottom: "40px" 
                }}>
                    {/* Card 1: Total de Simulações */}
                    <div style={{
                        backgroundColor: "white",
                        padding: "25px",
                        borderRadius: "12px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                    }}>
                        <div style={{ fontSize: "36px", fontWeight: "bold", color: "#333", marginBottom: "5px" }}>{totalSimulations}</div>
                        <div style={{ fontSize: "14px", color: "#666", fontWeight: "500" }}>Total de Simulações</div>
                        <div style={{ fontSize: "12px", color: "#999", marginTop: "5px" }}>Guardadas no sistema</div>
                    </div>

                    {/* Card 2: Simulações Este Mês - TODO: filtrar por mês atual */}
                    <div style={{
                        backgroundColor: "white",
                        padding: "25px",
                        borderRadius: "12px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                    }}>
                        <div style={{ fontSize: "36px", fontWeight: "bold", color: "#333", marginBottom: "5px" }}>{thisMonth}</div>
                        <div style={{ fontSize: "14px", color: "#666", fontWeight: "500" }}>Este Mês</div>
                        <div style={{ fontSize: "12px", color: "#999", marginTop: "5px" }}>Simulações recentes</div>
                    </div>

                    {/* Card 3: Média de Óbitos - calculada a partir de todas as simulações */}
                    <div style={{
                        backgroundColor: "white",
                        padding: "25px",
                        borderRadius: "12px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                    }}>
                        <div style={{ fontSize: "36px", fontWeight: "bold", color: "#333", marginBottom: "5px" }}>{avgDeaths}</div>
                        <div style={{ fontSize: "14px", color: "#666", fontWeight: "500" }}>Média de Óbitos</div>
                        <div style={{ fontSize: "12px", color: "#999", marginTop: "5px" }}>Por simulação</div>
                    </div>
                </div>

                {/* Lista de Simulações - tabela responsiva */}
                <div style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    padding: windowWidth <= 480 ? "20px" : "30px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    overflowX: windowWidth <= 768 ? "auto" : "visible" // Scroll horizontal em mobile se necessário
                }}>
                    <h3 style={{ margin: "0 0 25px 0", color: "#63b099", fontSize: "20px" }}>Histórico de Simulações</h3>
                    
                    {/* Mensagem se não houver simulações */}
                    {simulations.length === 0 ? (
                        <p style={{ color: "#999", textAlign: "center", padding: "40px 0" }}>Não existem simulações guardadas.</p>
                    ) : (
                        /* Lista de simulações - cada item é um card */
                        <div>
                            {simulations.map(sim => (
                                /* Card de simulação individual */
                                <div key={sim.id} style={{
                                    padding: windowWidth <= 480 ? "16px" : "20px",
                                    border: "1px solid #f0f0f0",
                                    borderRadius: "8px",
                                    marginBottom: "15px",
                                    display: "flex",
                                    flexDirection: windowWidth <= 768 ? "column" : "row", // Coluna em mobile, linha em desktop
                                    gap: windowWidth <= 768 ? "12px" : "0",
                                    justifyContent: "space-between",
                                    alignItems: windowWidth <= 768 ? "stretch" : "center"
                                }}>
                                    {/* Informações da simulação */}
                                    <div>
                                        <h4 style={{ margin: "0 0 8px 0", color: "#333", fontSize: "16px" }}>{sim.nome || "Sem nome"}</h4>
                                        <div style={{ display: "flex", gap: "20px", fontSize: "13px", color: "#666" }}>
                                            <span>{sim.data || "Data não disponível"}</span>
                                            <span>Pico: {(sim.pico || 0).toLocaleString()}</span>
                                            <span>Óbitos: {(sim.obitos || 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    {/* Botões de ação - Ver Detalhes e Eliminar */}
                                    <div style={{ display: "flex", gap: "10px", width: windowWidth <= 768 ? "100%" : "auto" }}>
                                        {/* Botão Ver Detalhes - navega para /simulacao com state */}
                                        <button 
                                            onClick={() => handleVerDetalhes(sim)}
                                            style={{
                                                backgroundColor: "#63b099",
                                                color: "white",
                                                border: "none",
                                                padding: "8px 16px",
                                                borderRadius: "5px",
                                                cursor: "pointer",
                                                fontSize: "13px",
                                                transition: "background-color 0.2s",
                                                flex: windowWidth <= 768 ? "1" : "none" // Ocupa metade em mobile
                                            }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = "#52a088"}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = "#63b099"}
                                        >
                                            Ver Detalhes
                                        </button>
                                        {/* Botão Eliminar - remove do state e localStorage */}
                                        <button 
                                            onClick={() => handleDelete(sim.id)}
                                            style={{
                                                backgroundColor: "#e74c3c",
                                                color: "white",
                                                border: "none",
                                                padding: "8px 16px",
                                                borderRadius: "5px",
                                                cursor: "pointer",
                                                fontSize: "13px",
                                                transition: "background-color 0.2s",
                                                flex: windowWidth <= 768 ? "1" : "none"
                                            }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = "#c0392b"}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = "#e74c3c"}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
