import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/medceilogo.png";

function Navbar({ nome = "Utilizador" }) {
    const { logout } = useAuth();

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '15px 40px',
            backgroundColor: 'white',
            borderBottom: '1px solid #eee',
            marginBottom: '0px'
        }}>
            {/* Lado Esquerdo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img
                    src={logo}
                    alt="Logo MEDCEI"
                    style={{ height: '50px' }}
                />
            </div>

            {/* Lado Direito */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <span style={{ fontWeight: 'bold', color: '#444' }}>Olá, {nome}</span>

                <Link to="/perfil" style={{ textDecoration: 'none', color: '#599F86', fontWeight: 'bold' }}>
                    Meu Perfil
                </Link>

                <Link 
                    to="/" 
                    onClick={logout}
                    style={{
                        textDecoration: 'none',
                        color: '#d32f2f',
                        border: '1px solid #d32f2f',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        fontWeight: 'bold'
                    }}>
                    Sair
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;