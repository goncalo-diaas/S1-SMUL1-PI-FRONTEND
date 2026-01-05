import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Botao from "../components/Botao";
import Input from "../components/Input";
import Card from "../components/Card";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/medceilogo.png";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    console.log("Login component rendered");

    function handleSubmit(e) {
        e.preventDefault();

        // Verifica se é o admin
        if (email === "admin@medcei.com" && password === "admin123123") {
            login({ nome: "Administrador", email: "admin@medcei.com", isAdmin: true });
            alert("Login de administrador efetuado com sucesso!");
            navigate('/admin');
            return;
        }

        // Procura os utilizadores registados do localStorage
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        
        if (registeredUsers.length === 0) {
            alert("Conta não encontrada. Por favor, crie uma conta.");
            return;
        }
        
        // Procura o utilizador com o email correspondente
        const userData = registeredUsers.find(user => user.email === email);
        
        if (!userData) {
            alert("Conta não encontrada. Por favor, crie uma conta.");
            return;
        }
        
        // Verifica a password
        if (userData.password !== password) {
            alert("Password incorreta.");
            return;
        }
        
        // Guarda os dados do utilizador no contexto
        login(userData);

        console.log("A fazer login:", email);
        alert("Login efetuado com sucesso!");
        
        // Redireciona para a simulação
        navigate('/simulacao');
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F8F6' }}>
            <Card>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                    <img
                        src={logo}
                        alt="Logo MEDCEI"
                        style={{ height: '80px', objectFit: 'contain' }}
                    />
                </div>
                
                <h2 style={{ color: '#599F86', marginBottom: '5px', textAlign: 'center' }}>Bem-vindo</h2>
                <p style={{ color: '#666', marginBottom: '20px', textAlign: 'center', fontSize: '14px' }}>Faça login para continuar</p>

                <form onSubmit={handleSubmit}>
                    <Input
                        label="Email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="A sua password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Botao texto="Entrar" tipo="submit" />
                </form>

                <p style={{ marginTop: '20px', fontSize: '1rem', color: '#666' }}>
                    Ainda não tem conta?{" "}
                    <Link
                        to="/register"
                        style={{ color: '#599F86', fontWeight: 'bold', textDecoration: 'none' }}
                    >
                        Criar Conta
                    </Link>
                </p>
            </Card>
        </div>
    );
}
