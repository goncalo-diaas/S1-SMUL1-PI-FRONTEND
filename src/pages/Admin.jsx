import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function Admin() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [editandoUsuario, setEditandoUsuario] = useState(null);
    const [dadosEdicao, setDadosEdicao] = useState({ nome: '', email: '', password: '' });

    useEffect(() => {
        // Verifica se o utilizador é admin
        if (!user || !user.isAdmin) {
            alert("Acesso negado! Apenas administradores podem aceder a esta página.");
            navigate("/login");
            return;
        }

        // Carrega os utilizadores do localStorage
        carregarUsuarios();
    }, [user, navigate]);

    function carregarUsuarios() {
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        setUsuarios(registeredUsers);
    }

    function handleEliminar(email) {
        if (window.confirm(`Tem a certeza que deseja eliminar o utilizador ${email}?`)) {
            const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            const novosUsuarios = registeredUsers.filter(u => u.email !== email);
            localStorage.setItem('registeredUsers', JSON.stringify(novosUsuarios));
            setUsuarios(novosUsuarios);
            alert("Utilizador eliminado com sucesso!");
        }
    }
    
    function handleEditar(usuario) {
        setEditandoUsuario(usuario.email);
        setDadosEdicao({ nome: usuario.nome, email: usuario.email, password: usuario.password });
    }
    
    function handleCancelarEdicao() {
        setEditandoUsuario(null);
        setDadosEdicao({ nome: '', email: '', password: '' });
    }
    
    function handleGuardarEdicao(emailOriginal) {
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const index = registeredUsers.findIndex(u => u.email === emailOriginal);
        
        if (index !== -1) {
            registeredUsers[index] = dadosEdicao;
            localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
            setUsuarios(registeredUsers);
            setEditandoUsuario(null);
            alert("Utilizador atualizado com sucesso!");
        }
    }

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#F3F8F6" }}>
            <Navbar nome="Administrador" />

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
                        Gestão de Utilizadores
                    </h2>
                    <p style={{ margin: 0, fontSize: "15px", opacity: 0.9 }}>Visualize e gerencie todos os utilizadores do sistema</p>
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

            {/* Tabela de Utilizadores */}
            <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
                <div style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    padding: "30px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                }}>
                    <h3 style={{ margin: "0 0 25px 0", color: "#63b099", fontSize: "20px" }}>
                        Utilizadores Registados ({usuarios.length})
                    </h3>
                    
                    {usuarios.length === 0 ? (
                        <p style={{ color: "#999", textAlign: "center", padding: "40px 0" }}>Não existem utilizadores registados.</p>
                    ) : (
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
                                        <th style={{ padding: "15px", textAlign: "left", color: "#666", fontWeight: "600" }}>Nome</th>
                                        <th style={{ padding: "15px", textAlign: "left", color: "#666", fontWeight: "600" }}>Email</th>
                                        <th style={{ padding: "15px", textAlign: "left", color: "#666", fontWeight: "600" }}>Password</th>
                                        <th style={{ padding: "15px", textAlign: "center", color: "#666", fontWeight: "600" }}>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usuarios.map((usuario, index) => (
                                        <tr key={index} style={{ borderBottom: "1px solid #f0f0f0" }}>
                                            {editandoUsuario === usuario.email ? (
                                                <>
                                                    <td style={{ padding: "15px" }}>
                                                        <input 
                                                            type="text"
                                                            value={dadosEdicao.nome}
                                                            onChange={(e) => setDadosEdicao({...dadosEdicao, nome: e.target.value})}
                                                            style={{
                                                                width: "100%",
                                                                padding: "8px",
                                                                border: "1px solid #ddd",
                                                                borderRadius: "4px"
                                                            }}
                                                        />
                                                    </td>
                                                    <td style={{ padding: "15px" }}>
                                                        <input 
                                                            type="email"
                                                            value={dadosEdicao.email}
                                                            onChange={(e) => setDadosEdicao({...dadosEdicao, email: e.target.value})}
                                                            style={{
                                                                width: "100%",
                                                                padding: "8px",
                                                                border: "1px solid #ddd",
                                                                borderRadius: "4px"
                                                            }}
                                                        />
                                                    </td>
                                                    <td style={{ padding: "15px" }}>
                                                        <input 
                                                            type="text"
                                                            value={dadosEdicao.password}
                                                            onChange={(e) => setDadosEdicao({...dadosEdicao, password: e.target.value})}
                                                            style={{
                                                                width: "100%",
                                                                padding: "8px",
                                                                border: "1px solid #ddd",
                                                                borderRadius: "4px",
                                                                fontFamily: "monospace"
                                                            }}
                                                        />
                                                    </td>
                                                    <td style={{ padding: "15px", textAlign: "center" }}>
                                                        <div style={{ display: "flex", gap: "5px", justifyContent: "center" }}>
                                                            <button
                                                                onClick={() => handleGuardarEdicao(usuario.email)}
                                                                style={{
                                                                    backgroundColor: "#63b099",
                                                                    color: "white",
                                                                    border: "none",
                                                                    padding: "8px 16px",
                                                                    borderRadius: "5px",
                                                                    cursor: "pointer",
                                                                    fontSize: "13px"
                                                                }}
                                                            >
                                                                Guardar
                                                            </button>
                                                            <button
                                                                onClick={handleCancelarEdicao}
                                                                style={{
                                                                    backgroundColor: "#95a5a6",
                                                                    color: "white",
                                                                    border: "none",
                                                                    padding: "8px 16px",
                                                                    borderRadius: "5px",
                                                                    cursor: "pointer",
                                                                    fontSize: "13px"
                                                                }}
                                                            >
                                                                Cancelar
                                                            </button>
                                                        </div>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td style={{ padding: "15px", color: "#333" }}>{usuario.nome}</td>
                                                    <td style={{ padding: "15px", color: "#333" }}>{usuario.email}</td>
                                                    <td style={{ padding: "15px", color: "#333" }}>
                                                        <span style={{ 
                                                            backgroundColor: "#f0f0f0", 
                                                            padding: "4px 8px", 
                                                            borderRadius: "4px",
                                                            fontFamily: "monospace",
                                                            fontSize: "13px"
                                                        }}>
                                                            {usuario.password}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: "15px", textAlign: "center" }}>
                                                        <div style={{ display: "flex", gap: "5px", justifyContent: "center" }}>
                                                            <button
                                                                onClick={() => handleEditar(usuario)}
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
                                                                Editar
                                                            </button>
                                                            <button
                                                                onClick={() => handleEliminar(usuario.email)}
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
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
