import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { useWindowSize } from "../hooks/useWindowSize";
import Toast from "../components/Toast";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import logo from "../assets/medceilogo.png";

/**
 * Página de Login
 * 
 * Funcionalidades:
 * - Formulário de autenticação com email e password
 * - Validação de credenciais contra localStorage
 * - Conta admin hardcoded (admin@medcei.com / admin123123)
 * - Redirecionamento automático se já autenticado
 * - Notificações toast para feedback ao utilizador
 * - Design responsivo para mobile e desktop
 * 
 * Fluxo:
 * 1. Utilizador insere email e password
 * 2. Sistema verifica se é conta admin
 * 3. Se não, procura nos utilizadores registados (localStorage)
 * 4. Valida password
 * 5. Faz login e redireciona para /simulacao
 */
export default function Login() {
    // Estados do formulário
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    // Hooks
    const { login, user } = useAuth();
    const navigate = useNavigate();
    const { width: windowWidth } = useWindowSize();
    const { toast, showToast, hideToast } = useToast();

    // Redireciona automaticamente se utilizador já está autenticado
    useEffect(() => {
        if (user) {
            navigate('/simulacao', { replace: true });
        }
    }, [user, navigate]);

    // Ecrã de carregamento durante redirecionamento
    if (user) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '100vh',
                backgroundColor: '#F3F8F6'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                        fontSize: '48px', 
                        marginBottom: '20px',
                        animation: 'spin 1s linear infinite'
                    }}>⏳</div>
                    <p style={{ color: '#63b099', fontSize: '18px' }}>Redirecionando...</p>
                </div>
            </div>
        );
    }

    /**
     * Manipula o submit do formulário de login
     * 
     * Fluxo de validação:
     * 1. Verifica se é conta admin (email/password hardcoded)
     * 2. Busca utilizadores registados no localStorage (Por alterar por causa do backend)
     * 3. Procura utilizador pelo email
     * 4. Valida password
     * 5. Faz login e redireciona
     */
    function handleSubmit(e) {
        e.preventDefault();

        // Conta admin especial (hardcoded)
        if (email === "admin@medcei.com" && password === "admin123123") {
            login({ nome: "Administrador", email: "admin@medcei.com", isAdmin: true });
            showToast("Login efetuado com sucesso!", "success");
            navigate('/simulacao');
            return;
        }

        // Busca utilizadores registados no localStorage
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        
        // Verifica se existem utilizadores registados
        if (registeredUsers.length === 0) {
            showToast("Conta não encontrada. Por favor, crie uma conta.", "error");
            return;
        }
        
        // Procura utilizador pelo email
        const userData = registeredUsers.find(user => user.email === email);
        
        if (!userData) {
            showToast("Conta não encontrada. Por favor, crie uma conta.", "error");
            return;
        }
        
        // Valida password
        if (userData.password !== password) {
            showToast("Password incorreta.", "error");
            return;
        }
        
        // Login bem-sucedido
        login(userData);
        showToast("Login efetuado com sucesso!", "success");
        navigate('/simulacao');
    }

    return (
        /* Container principal - fullscreen com gradiente de fundo e centralização */
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, rgba(99, 176, 153, 0.1) 0%, rgba(99, 176, 153, 0.05) 100%)',
            padding: windowWidth <= 480 ? '16px' : '20px' // Padding reduzido em mobile
        }}>
            {/* Card de login - largura máxima 440px */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
                width: '100%',
                maxWidth: '440px',
                padding: windowWidth <= 480 ? '24px' : '40px' // Padding interno responsivo
            }}>
                {/* Secção do logo e título */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    {/* Logo da aplicação */}
                    <img
                        src={logo}
                        alt="MEDCEI Logo"
                        style={{ height: '60px', marginBottom: '16px' }}
                    />
                    {/* Título de boas-vindas */}
                    <h2 style={{
                        margin: '0 0 8px 0',
                        fontSize: '28px',
                        fontWeight: '600',
                        color: '#1f2937'
                    }}>
                        Bem-vindo de volta
                    </h2>
                    {/* Subtítulo */}
                    <p style={{
                        margin: 0,
                        color: '#64748b',
                        fontSize: '15px'
                    }}>
                        Faça login para continuar
                    </p>
                </div>

                {/* Formulário de login - onSubmit chama handleSubmit para validação */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Campo de email - required garante validação HTML5 */}
                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        icon={Mail}
                        required
                    />

                    {/* Campo de password - type="password" oculta caracteres */}
                    <Input
                        type="password"
                        placeholder="Palavra-passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        icon={Lock}
                        required
                    />

                    {/* Botão de submit - fullWidth ocupa toda a largura */}
                    <Button type="submit" variant="primary" fullWidth>
                        Entrar
                    </Button>
                </form>

                {/* Link para página de registo - para novos utilizadores */}
                <div style={{ marginTop: '24px', textAlign: 'center' }}>
                    <p style={{
                        margin: 0,
                        color: '#64748b',
                        fontSize: '14px'
                    }}>
                        Não tem uma conta?{' '}
                        <Link
                            to="/register"
                            style={{
                                color: '#63b099',
                                textDecoration: 'none',
                                fontWeight: '600'
                            }}
                            onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                            onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                        >
                            Registe-se
                        </Link>
                    </p>
                </div>
            </div>

            {/* Toast de notificação - aparece quando toast existe, com mensagem e tipo (success/error) */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
        </div>
    );
}
