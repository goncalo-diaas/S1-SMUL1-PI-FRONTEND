import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, LogOut, Shield, User, History, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useWindowSize } from "../hooks/useWindowSize";
import logo from "../assets/medceilogo.png";

/**
 * Componente Navbar - Barra de navegação principal da aplicação
 * 
 * Funcionalidades:
 * - Exibe logo e título da aplicação
 * - Menu responsivo (desktop e mobile)
 * - Navegação para Perfil, Histórico, Admin (se aplicável)
 * - Botão de logout
 * - Fecha menu mobile automaticamente quando a janela é redimensionada
 * 
 * @param {string} nome - Nome do utilizador a exibir no menu
 */
function Navbar({ nome = "Utilizador" }) {
    // Hooks de autenticação e navegação
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    // Estado do menu mobile (aberto/fechado)
    const [menuAberto, setMenuAberto] = useState(false);
    
    // Hook customizado para obter largura da janela de forma reativa
    const { width: windowWidth } = useWindowSize();

    // Fecha o menu mobile automaticamente quando a janela é redimensionada para desktop
    useEffect(() => {
        if (windowWidth > 768) {
            setMenuAberto(false);
        }
    }, [windowWidth]);

    /**
     * Função para fazer logout do utilizador
     * - Remove dados de autenticação
     * - Fecha menu mobile
     * - Redireciona para página de login
     */
    function handleLogout() {
        logout();
        navigate("/", { replace: true });
        setMenuAberto(false);
    }

    // Verifica se o utilizador tem permissões de administrador
    const isAdmin = user?.isAdmin;

    return (
        // Header fixo no topo da página (sempre visível durante scroll)
        <header style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: 'white',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            borderBottom: '1px solid #e5e7eb',
            zIndex: 1000 // Garante que fica acima de outros elementos
        }}>
            <div style={{
                maxWidth: '1800px',
                margin: '0 auto',
                padding: '0 16px'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 0',
                    minHeight: '70px'
                }}>
                    {/* Logo e Título - Clicável para navegar para página de simulação */}
                    <div 
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px',
                            cursor: 'pointer',
                            flex: 1
                        }}
                        onClick={() => navigate('/simulacao')}
                    >
                        <img
                            src={logo}
                            alt="MEDCEI Logo"
                            style={{ 
                                height: '40px',
                                width: 'auto'
                            }}
                        />
                        {/* Título visível apenas em desktop (>768px) */}
                        <div style={{ display: windowWidth > 768 ? 'block' : 'none' }}>
                            <h1 style={{ 
                                color: '#63b099', 
                                margin: 0,
                                fontSize: windowWidth > 768 ? '24px' : '18px',
                                fontWeight: '600'
                            }}>
                                Simulador de Epidemias
                            </h1>
                            {/* Subtítulo visível apenas em ecrãs grandes (>1024px) */}
                            <p style={{ 
                                color: '#64748b', 
                                margin: 0,
                                fontSize: '14px',
                                display: windowWidth > 1024 ? 'block' : 'none'
                            }}>
                                Modelagem e análise epidemiológica
                            </p>
                        </div>
                    </div>

                    {/* Botão Menu Mobile - Visível apenas em ecrãs pequenos (≤768px) */}
                    <button
                        onClick={() => setMenuAberto(!menuAberto)}
                        style={{
                            display: windowWidth <= 768 ? 'flex' : 'none',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '8px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#63b099'
                        }}
                    >
                        {/* Alterna entre ícone X (fechar) e Menu (abrir) */}
                        {menuAberto ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    {/* Menu Desktop - Visível apenas em ecrãs grandes (>768px) */}
                    <div style={{ 
                        display: windowWidth > 768 ? 'flex' : 'none',
                        alignItems: 'center', 
                        gap: '16px' 
                    }}>
                        <Activity 
                            size={24} 
                            style={{ color: '#63b099' }}
                        />
                        
                        {/* Botões de navegação - Apenas visíveis se utilizador autenticado */}
                        {user && (
                            <>
                                {/* Botão Perfil */}
                                <button
                                    onClick={() => navigate('/perfil')}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        color: '#334155',
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '15px',
                                        fontWeight: '500',
                                        transition: 'color 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.color = '#63b099'}
                                    onMouseOut={(e) => e.currentTarget.style.color = '#334155'}
                                >
                                    <User size={20} />
                                    <span>{nome}</span>
                                </button>

                                {/* Botão Histórico */}
                                <button
                                    onClick={() => navigate('/historico')}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '8px 16px',
                                        backgroundColor: '#dbeafe',
                                        color: '#2563eb',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '15px',
                                        fontWeight: '500',
                                        transition: 'background-color 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#bfdbfe'}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dbeafe'}
                                >
                                    <History size={18} />
                                    <span>Histórico</span>
                                </button>

                                {/* Botão Admin - Apenas visível se utilizador for administrador */}
                                {isAdmin && (
                                    <button
                                        onClick={() => navigate('/admin')}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            padding: '8px 16px',
                                            backgroundColor: 'rgba(99, 176, 153, 0.1)',
                                            color: '#63b099',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '15px',
                                            fontWeight: '500',
                                            transition: 'background-color 0.2s'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(99, 176, 153, 0.2)'}
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(99, 176, 153, 0.1)'}
                                    >
                                        <Shield size={18} />
                                        <span>Admin</span>
                                    </button>
                                )}

                                {/* Botão Sair - Faz logout e redireciona */}
                                <button 
                                    onClick={handleLogout}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '8px 16px',
                                        backgroundColor: '#fee2e2',
                                        color: '#dc2626',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '15px',
                                        fontWeight: '500',
                                        transition: 'background-color 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fecaca'}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                                >
                                    <LogOut size={18} />
                                    <span>Sair</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Menu Mobile Dropdown - Visível apenas quando menuAberto=true e windowWidth≤768px */}
                {menuAberto && windowWidth <= 768 && (
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: 'white',
                        borderTop: '1px solid #e5e7eb',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                    }}>
                        {user && (
                            <>
                                <button
                                    onClick={() => {
                                        navigate('/perfil');
                                        setMenuAberto(false);
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px 16px',
                                        backgroundColor: 'transparent',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '15px',
                                        fontWeight: '500',
                                        color: '#334155',
                                        width: '100%',
                                        textAlign: 'left'
                                    }}
                                >
                                    <User size={20} />
                                    <span>{nome}</span>
                                </button>

                                <button
                                    onClick={() => {
                                        navigate('/historico');
                                        setMenuAberto(false);
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px 16px',
                                        backgroundColor: 'transparent',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '15px',
                                        fontWeight: '500',
                                        color: '#334155',
                                        width: '100%',
                                        textAlign: 'left'
                                    }}
                                >
                                    <History size={20} />
                                    <span>Histórico</span>
                                </button>

                                {isAdmin && (
                                    <button
                                        onClick={() => {
                                            navigate('/admin');
                                            setMenuAberto(false);
                                        }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '12px 16px',
                                            backgroundColor: 'rgba(99, 176, 153, 0.1)',
                                            border: '1px solid #63b099',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '15px',
                                            fontWeight: '500',
                                            color: '#63b099',
                                            width: '100%',
                                            textAlign: 'left'
                                        }}
                                    >
                                        <Shield size={20} />
                                        <span>Admin</span>
                                    </button>
                                )}

                                <button 
                                    onClick={handleLogout}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px 16px',
                                        backgroundColor: '#fee2e2',
                                        border: '1px solid #dc2626',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '15px',
                                        fontWeight: '500',
                                        color: '#dc2626',
                                        width: '100%',
                                        textAlign: 'left'
                                    }}
                                >
                                    <LogOut size={20} />
                                    <span>Sair</span>
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}

export default Navbar;