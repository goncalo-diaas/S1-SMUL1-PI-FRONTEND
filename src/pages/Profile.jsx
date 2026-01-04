import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import Botao from "../components/Botao";
import Input from "../components/Input";

function Profile() {

    const [isEditing, setIsEditing] = useState(false);

    const [user, setUser] = useState({
        nome: "Miguel Pereira",
        email: "miguelpereira11@gmail.com",
        tipo: "Utilizador",
        membroDesde: "06/12/2025"
    });

    const [tempUser, setTempUser] = useState(user);

    const [stats, setStats] = useState({
        totalsimulacoes: 42,
        simulacoesMesAtual: 5,
        ultimaSimulacao: "26/12/2025"
    });

    function handleEditar() {
        setTempUser(user);
        setIsEditing(true);
    }

    function handleCancelar() {
        setIsEditing(false);
    }

    function handleGuardar(e) {
        e.preventDefault();
        setUser(tempUser);
        setIsEditing(false);
        alert("Perfil atualizado com sucesso!")
    }

    return (
        <div style={{ backgroundColor: '#F3F8F6', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar nome={user.nome} />
            <div style={{ backgroundColor: '#599F86', padding: '40px 20px 80px 20px', color: 'white' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                    <div>
                        <h1 style={{ margin: 0 }}>O Meu Perfil</h1>
                        <p style={{ opacity: '0.9', marginTop: '5px' }}>Configure as suas informações pessoais</p>
                    </div>

                    <Link to="/" style={{
                        color: 'white',
                        border: '1px solid white',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        fontSize: '1rem'
                    }}>
                        ← Voltar ao Início

                    </Link>
                </div>
            </div>

            <div style={{
                maxWidth: '1000px',
                width: '100%',
                margin: '-50px auto 40px auto',
                padding: '0 20px',
                display: 'flex',
                gap: '20px',
                flexWrap: 'wrap',
                boxSizing: 'border-box'
            }}>

                <div style={{ flex: '2', minWidth: '300px' }}>
                    <Card>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                            <h3 style={{ margin: 0, color: '#599F86' }}>Informações pessoais</h3>

                            {!isEditing && (
                                <button onClick={handleEditar} style={styles.btnLink}>
                                    Editar
                                </button>
                            )}
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleGuardar}>
                                <Input
                                    label="Nome"
                                    value={tempUser.nome}
                                    onChange={(e) => setTempUser({ ...tempUser, nome: e.target.value })}
                                />
                                <Input
                                    label="Email"
                                    value={tempUser.email}
                                    onChange={(e) => setTempUser({ ...tempUser, email: e.target.value })}
                                />

                                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                    <Botao texto="Guardar" tipo="submit" />
                                    <button type="button" onClick={handleCancelar} style={styles.btnCancelar}>
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        ) : (

                            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <InfoRow label="Nome Completo" value={user.nome} />
                                <InfoRow label="Email" value={user.email} />
                                <InfoRow label="Tipo de Conta" value={user.tipo} />
                                <InfoRow label="Membro Desde" value={user.membroDesde} />
                            </div>
                        )}
                    </Card>
                </div>

                <div style={{ flex: '1', minWidth: '250px' }}>
                    <Card>
                        <h3 style={{ margin: '0 0 20px 0', color: '#599F86', textAlign: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                            Estatísticas
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', marginBottom: '20px' }}>
                            <div style={styles.statBox}>
                                <span style={styles.statNumber}>{stats.totalsimulacoes}</span>
                                <span style={styles.statLabel}>Total Simulações</span>
                            </div>
                            <div style={styles.statBox}>
                                <span style={styles.statNumber}>{stats.simulacoesMesAtual}</span>
                                <span style={styles.statLabel}>Este Mês</span>
                            </div>
                        </div>

                        <div style={{ backgroundColor: '#E6F2F5', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                            <span style={{ display: 'block', fontSize: '0.9rem', color: '#666' }}>Última Simulação</span>
                            <span style={{ display: 'block', fontWeight: 'bold', color: '#444', fontSize: '1.1rem' }}>
                                {stats.ultimaSimulacao}
                            </span>
                        </div>
                    </Card>
                </div>

            </div>
        </div>
    );
}

function InfoRow({ label, value, highlight = false }) {
    return (
        <div>
            <span style={{ display: 'block', fontSize: '0.85rem', color: '#888', fontWeight: 'bold' }}>{label}</span>
            <span style={{
                display: 'block',
                fontSize: '1.1rem',
                color: highlight ? '#599F86' : '#333',
                fontWeight: highlight ? 'bold' : '500'
            }}>
                {value}
            </span>
        </div>
    );
}

const styles = {
    btnLink: {
        background: 'none',
        border: 'none',
        color: '#599F86',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '0.9rem',
        textDecoration: 'underline'
    },
    btnCancelar: {
        flex: 1,
        padding: '16px',
        backgroundColor: '#eee',
        color: '#666',
        border: 'none',
        borderRadius: '6px',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '1rem',
        marginTop: '10px'
    },
    statBox: {
        backgroundColor: '#F9F9F9',
        padding: '20px',
        borderRadius: '10px',
        textAlign: 'center'
    },
    statNumber: {
        display: 'block',
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#599F86'
    },
    statLabel: {
        fontSize: '0.9rem',
        color: '#666'
    }
};

export default Profile;