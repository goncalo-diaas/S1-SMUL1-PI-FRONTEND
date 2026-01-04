import { useState } from "react";
import { Link } from "react-router-dom";
import Botao from "../components/Botao";
import Input from "../components/Input";
import Card from "../components/Card";

function Register() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        if (password !== confirmPass) {
            alert("As passwords não coincidem");
            return;
        }
        console.log("A registar:", nome, email);
        alert("Conta criada com sucesso!");
    }

    return (
        <div style={{ minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F8F6' }}>
            <Card>
                <h1 style={{ color: '#599F86', marginBottom: '10px' }}> MEDCEI </h1>
                <h2 style={{ color: '#444', marginBottom: '20px' }}> Criar Conta </h2>

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
                        label="Confirmar Password" type="password" placeholder="Repita a password"
                        value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)}
                    />

                    <Botao texto="Registar" tipo="submit" />
                </form>

                <p style={{ marginTop: '20px', fontSize: '1rem', color: '#666' }}>
                    Já tem conta? <Link to="/" style={{ color: '#599F86', fontWeight: 'bold', textDecoration: 'none' }}>Faça Login</Link>
                </p>
            </Card>
        </div>
    );
}

export default Register;