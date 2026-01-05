import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Botao from "../components/Botao";
import Input from "../components/Input";
import Card from "../components/Card";
import logo from "../assets/medceilogo.png";

function Register() {

    const navigate = useNavigate();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();

        if (password.length < 6) {
            alert("A password tem de ter pelo menos 6 caracteres.");
            return;
        }

        if (password !== confirmPass) {
            alert("As passwords não coincidem");
            return;
        }

        setIsLoading(true);

        setTimeout(() => {
            // Extrai primeiro e último nome
            const nomes = nome.trim().split(' ');
            const primeiroNome = nomes[0];
            const ultimoNome = nomes.length > 1 ? nomes[nomes.length - 1] : '';
            const nomeCompleto = ultimoNome ? `${primeiroNome} ${ultimoNome}` : primeiroNome;

            // Guarda no localStorage
            const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            
            // Verifica se o email já existe
            const emailExists = registeredUsers.some(user => user.email === email);
            if (emailExists) {
                alert("Este email já está registado!");
                setIsLoading(false);
                return;
            }

            registeredUsers.push({
                nome: nomeCompleto,
                email: email,
                password: password
            });
            
            localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
            
            console.log("Registado:", nomeCompleto, email);
            alert("Conta criada com sucesso!");
            navigate("/");
            setIsLoading(false);
        }, 1500);
    }

    return (
        <div style={{ minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F8F6' }}>
            <Card>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                    <img
                        src={logo}
                        alt="Logo MEDCEI"
                        style={{ height: '80px', objectFit: 'contain' }}
                    />
                </div>

                <h2 style={{ color: '#599F86', marginBottom: '20px', textAlign: 'center' }}>
                    Criar Conta
                </h2>

                <form onSubmit={handleSubmit}>
                    <Input
                        label="Nome Completo" type="text" placeholder="O seu nome"
                        value={nome} onChange={(e) => setNome(e.target.value)}
                    />
                    <Input
                        label="Email" type="email" placeholder="seu@email.com"
                        value={email} onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        label="Password" type="password" placeholder="Mínimo 6 caracteres"
                        value={password} onChange={(e) => setPassword(e.target.value)}
                    />
                    <Input
                        label="Confirmar Password" type="password" placeholder="Digite a senha novamente"
                        value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)}
                    />
                    <div style={{ marginTop: '20px' }}>
                        <Botao
                            texto={isLoading ? "A criar conta..." : "Criar Conta"}
                            tipo="submit"
                        />
                    </div>
                </form>

                <p style={{ marginTop: '20px', fontSize: '1rem', color: '#666' }}>
                    Já tem uma conta? <Link to="/" style={{ color: '#599F86', fontWeight: 'bold', textDecoration: 'none' }}>Fazer Login</Link>
                </p>
            </Card>
        </div>
    );
}

export default Register;