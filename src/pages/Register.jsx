import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import { useToast } from "../hooks/useToast";
import { useWindowSize } from "../hooks/useWindowSize";
import Toast from "../components/Toast";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import logo from "../assets/medceilogo.png";

/**
 * Página de Registo
 * 
 * Funcionalidades:
 * - Formulário de criação de nova conta
 * - Validação de campos obrigatórios
 * - Validação de password (mínimo 6 caracteres)
 * - Confirmação de password (match)
 * - Verificação de email duplicado (localStorage)
 * - Armazenamento de utilizador em localStorage
 * - Redirecionamento para login após sucesso
 * - Notificações toast para feedback
 * - Design responsivo
 * 
 * Fluxo:
 * 1. Utilizador preenche nome, email, password e confirmação
 * 2. Sistema valida se campos estão preenchidos
 * 3. Verifica se passwords coincidem
 * 4. Valida tamanho mínimo da password (6 chars)
 * 5. Verifica se email já existe
 * 6. Cria novo utilizador e guarda em localStorage
 * 7. Redireciona para página de login
 */
export default function Register() {
    // Estados do formulário de registo
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    // Hooks
    const navigate = useNavigate();
    const { width: windowWidth } = useWindowSize();
    const { toast, showToast, hideToast } = useToast();

    /**
     * Manipula o submit do formulário de registo
     * 
     * Validações realizadas (por ordem):
     * 1. Campos obrigatórios preenchidos
     * 2. Password e confirmação coincidem
     * 3. Password tem pelo menos 6 caracteres
     * 4. Email não está já registado
     * 
     * Se tudo válido: cria utilizador, guarda em localStorage, redireciona para login
     */
    function handleSubmit(e) {
        e.preventDefault();

        // Validação 1: Verifica se todos os campos estão preenchidos
        if (!nome || !email || !password || !confirmPassword) {
            showToast("Por favor, preencha todos os campos.", "error");
            return;
        }

        // Validação 2: Passwords têm de coincidir
        if (password !== confirmPassword) {
            showToast("As palavras-passe não coincidem.", "error");
            return;
        }

        // Validação 3: Password deve ter pelo menos 6 caracteres
        if (password.length < 6) {
            showToast("A palavra-passe deve ter pelo menos 6 caracteres.", "error");
            return;
        }

        // Busca utilizadores existentes no localStorage
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        
        // Validação 4: Verifica se email já está registado
        const userExists = registeredUsers.some(user => user.email === email);

        if (userExists) {
            showToast("Este email já está registado.", "error");
            return;
        }

        // Cria novo utilizador
        const newUser = { nome, email, password };
        registeredUsers.push(newUser);
        
        // Guarda no localStorage
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

        // Mostra mensagem de sucesso e redireciona para login
        showToast("Conta criada com sucesso! Faça login para continuar.", "success");
        navigate('/');
    }

    return (
        /* Container principal - fullscreen com gradiente de fundo */
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, rgba(99, 176, 153, 0.1) 0%, rgba(99, 176, 153, 0.05) 100%)',
            padding: windowWidth <= 480 ? '16px' : '20px' // Padding responsivo
        }}>
            {/* Card de registo - máximo 440px de largura */}
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
                    <img
                        src={logo}
                        alt="MEDCEI Logo"
                        style={{ height: '60px', marginBottom: '16px' }}
                    />
                    <h2 style={{
                        margin: '0 0 8px 0',
                        fontSize: '28px',
                        fontWeight: '600',
                        color: '#1f2937'
                    }}>
                        Criar Conta
                    </h2>
                    <p style={{
                        margin: 0,
                        color: '#64748b',
                        fontSize: '15px'
                    }}>
                        Registe-se para começar
                    </p>
                </div>

                {/* Formulário de registo - 4 campos obrigatórios */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Campo de nome completo */}
                    <Input
                        type="text"
                        placeholder="Nome completo"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        icon={User}
                        required
                    />

                    {/* Campo de email - validação HTML5 automática */}
                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        icon={Mail}
                        required
                    />

                    {/* Campo de password - mínimo 6 caracteres validado em handleSubmit */}
                    <Input
                        type="password"
                        placeholder="Palavra-passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        icon={Lock}
                        required
                    />

                    {/* Campo de confirmação de password - deve coincidir com password */}
                    <Input
                        type="password"
                        placeholder="Confirmar palavra-passe"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        icon={Lock}
                        required
                    />

                    {/* Botão de submit - cria conta após validações */}
                    <Button type="submit" variant="primary" fullWidth>
                        Criar Conta
                    </Button>
                </form>

                {/* Link para página de login - para utilizadores já registados */}
                <div style={{ marginTop: '24px', textAlign: 'center' }}>
                    <p style={{
                        margin: 0,
                        color: '#64748b',
                        fontSize: '14px'
                    }}>
                        Já tem uma conta?{' '}
                        <Link
                            to="/"
                            style={{
                                color: '#63b099',
                                textDecoration: 'none',
                                fontWeight: '600'
                            }}
                            onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                            onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                        >
                            Faça login
                        </Link>
                    </p>
                </div>
            </div>

            {/* Toast de notificação - feedback de validações e sucesso */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
        </div>
    );
}
