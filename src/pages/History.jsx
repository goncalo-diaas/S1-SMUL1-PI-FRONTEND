import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function History() {
    const { user } = useAuth();
    const navigate = useNavigate();
    
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

    function carregarSimulacoes() {
        const simulacoesGuardadas = JSON.parse(localStorage.getItem('simulacoes') || '[]');
        // Filtra apenas as simulações do utilizador atual
        const simulacoesDoUtilizador = simulacoesGuardadas.filter(sim => sim.utilizador === user?.email);
        // Ordena da mais recente para a mais antiga (baseado no ID que é timestamp)
        simulacoesDoUtilizador.sort((a, b) => b.id - a.id);
        setSimulations(simulacoesDoUtilizador);
    }

    function handleDelete(id) {
        // Remove do estado local
        const filtered = simulations.filter(sim => sim.id !== id);
        setSimulations(filtered);
        
        // Remove do localStorage
        const todasSimulacoes = JSON.parse(localStorage.getItem('simulacoes') || '[]');
        const novasSimulacoes = todasSimulacoes.filter(sim => sim.id !== id);
        localStorage.setItem('simulacoes', JSON.stringify(novasSimulacoes));
    }
    
    function handleVerDetalhes(simulacao) {
        // Redireciona para a página de simulação com os dados
        navigate('/simulacao', { state: { simulacao } });
    }

    const totalSimulations = simulations.length;
    const thisMonth = simulations.length;
    const avgDeaths = simulations.length > 0 ? Math.round(simulations.reduce((acc, sim) => acc + sim.obitos, 0) / simulations.length) : 0;
    
    // Nome do utilizador com primeira letra maiúscula
    const userName = user?.nome ? user.nome.charAt(0).toUpperCase() + user.nome.slice(1) : "Administrador";

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#F3F8F6" }}>
            <Navbar nome={userName} />

            {/* Hero Section */}
            <div style={{
                backgroundColor: "#63b099",
                color: "white",
                padding: "40px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <div>
                    <h2 style={{ margin: "0 0 8px 0", fontSize: "32px" }}>
                        Histórico de Simulações
                    </h2>
                    <p style={{ margin: 0, fontSize: "15px", opacity: 0.9 }}>Aceda e faça a gestão das suas simulações anteriores</p>
                </div>
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
                        border: "1px solid rgba(255,255,255,0.3)"
                    }}
                >
                    Voltar ao Simulador
                </Link>
            </div>

            {/* Stats Cards */}
            <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "40px" }}>
                    {/* Card 1 */}
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

                    {/* Card 2 */}
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

                    {/* Card 3 */}
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

                {/* Lista de Simulações */}
                <div style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    padding: "30px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                }}>
                    <h3 style={{ margin: "0 0 25px 0", color: "#63b099", fontSize: "20px" }}>Histórico de Simulações</h3>
                    
                    {simulations.length === 0 ? (
                        <p style={{ color: "#999", textAlign: "center", padding: "40px 0" }}>Não existem simulações guardadas.</p>
                    ) : (
                        <div>
                            {simulations.map(sim => (
                                <div key={sim.id} style={{
                                    padding: "20px",
                                    border: "1px solid #f0f0f0",
                                    borderRadius: "8px",
                                    marginBottom: "15px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}>
                                    <div>
                                        <h4 style={{ margin: "0 0 8px 0", color: "#333", fontSize: "16px" }}>{sim.nome}</h4>
                                        <div style={{ display: "flex", gap: "20px", fontSize: "13px", color: "#666" }}>
                                            <span>{sim.data}</span>
                                            <span>Pico: {sim.pico.toLocaleString()}</span>
                                            <span>Óbitos: {sim.obitos.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", gap: "10px" }}>
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
                                                transition: "background-color 0.2s"
                                            }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = "#52a088"}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = "#63b099"}
                                        >
                                            Ver Detalhes
                                        </button>
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
                                                transition: "background-color 0.2s"
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
