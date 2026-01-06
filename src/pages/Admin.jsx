import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { useWindowSize } from "../hooks/useWindowSize";
import Toast from "../components/Toast";
import Navbar from "../components/Navbar";
import PageHeader from "../components/common/PageHeader";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import StatsGrid from "../components/admin/StatsGrid";
import UsersTable from "../components/admin/UsersTable";
import { Shield } from "lucide-react";

/**
 * Página de Administração
 * 
 * Funcionalidades:
 * - Painel exclusivo para administradores (user.isAdmin = true)
 * - Gestão completa de utilizadores (CRUD):
 *   * Listagem de todos os utilizadores registados
 *   * Edição de utilizadores (nome, email, password)
 *   * Eliminação de utilizadores
 * - Estatísticas do sistema:
 *   * Total de utilizadores
 *   * Utilizadores ativos
 *   * Novos utilizadores este mês
 * - Proteção de rota: apenas admins acedem
 * - Design responsivo com componentes reutilizáveis
 * 
 * Fluxo:
 * 1. Verifica se utilizador é admin (useEffect)
 * 2. Carrega utilizadores do localStorage
 * 3. Exibe estatísticas em cards (StatsGrid)
 * 4. Exibe tabela de utilizadores (UsersTable)
 * 5. Permite editar (modo inline edit) e eliminar (com confirmação)
 * 6. Persiste alterações em localStorage
 */
export default function Admin() {
    // Contexto e hooks
    const { user } = useAuth();
    const navigate = useNavigate();
    const { toast, showToast, hideToast } = useToast();
    const { width: windowWidth } = useWindowSize();
    
    // Estados de gestão de utilizadores
    const [utilizadores, setUtilizadores] = useState([]); // Lista de todos os utilizadores
    const [editandoUsuario, setEditandoUsuario] = useState(null); // Email do utilizador em edição (null se nenhum)
    const [dadosEdicao, setDadosEdicao] = useState({ nome: '', email: '', password: '' }); // Dados temporários durante edição

    /**
     * Proteção de rota: apenas administradores acedem
     * Se não for admin, mostra toast de erro e redireciona para login
     */
    useEffect(() => {
        if (!user || !user.isAdmin) {
            showToast("Acesso negado! Apenas administradores podem aceder.", "error");
            navigate("/login");
            return;
        }
        carregarUtilizadores();
    }, [user, navigate]);

    /**
     * Carrega lista de utilizadores do localStorage
     * Todos os utilizadores registados exceto o admin hardcoded
     */
    function carregarUtilizadores() {
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        setUtilizadores(registeredUsers);
    }

    /**
     * Elimina um utilizador
     * - Mostra confirmação antes de eliminar
     * - Remove do localStorage
     * - Atualiza estado local
     * - Mostra toast de sucesso
     */
    function handleEliminar(email) {
        if (window.confirm(`Tem a certeza que deseja eliminar o utilizador ${email}?`)) {
            const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            const novosUtilizadores = registeredUsers.filter(u => u.email !== email);
            localStorage.setItem('registeredUsers', JSON.stringify(novosUtilizadores));
            setUtilizadores(novosUtilizadores);
            showToast("Utilizador eliminado com sucesso!", "success");
        }
    }
    
    /**
     * Ativa modo de edição para um utilizador
     * - Define qual utilizador está sendo editado (por email)
     * - Copia dados atuais para estado temporário (dadosEdicao)
     */
    function handleEditar(usuario) {
        setEditandoUsuario(usuario.email);
        setDadosEdicao({ nome: usuario.nome, email: usuario.email, password: usuario.password });
    }
    
    /**
     * Cancela edição
     * - Limpa estado de edição
     * - Descarta alterações temporárias
     */
    function handleCancelarEdicao() {
        setEditandoUsuario(null);
        setDadosEdicao({ nome: '', email: '', password: '' });
    }
    
    /**
     * Guarda alterações de edição
     * - Busca utilizador pelo email original
     * - Atualiza dados no localStorage
     * - Atualiza estado local
     * - Sai do modo edição
     * - Mostra toast de sucesso
     */
    function handleGuardarEdicao(emailOriginal) {
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const index = registeredUsers.findIndex(u => u.email === emailOriginal);
        
        if (index !== -1) {
            registeredUsers[index] = dadosEdicao;
            localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
            setUtilizadores(registeredUsers);
            setEditandoUsuario(null);
            showToast("Utilizador atualizado com sucesso!", "success");
        }
    }

    // Proteção adicional: retorna null se não for admin (evita flash de conteúdo)
    if (!user || !user.isAdmin) {
        return null;
    }

    return (
        /* Container principal do painel admin */
        <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa", paddingTop: "90px" }}>
            {/* Navbar fixo no topo */}
            <Navbar nome={user?.nome || "Administrador"} />
            
            {/* Cabeçalho da página com botão de voltar */}
            <PageHeader
                title="Painel de Administração"
                subtitle="Gestão de utilizadores do sistema"
                icon={Shield}
                actionButton={
                    <Button
                        variant="light"
                        onClick={() => navigate('/simulacao')}
                    >
                        Voltar ao Simulador
                    </Button>
                }
            />

            {/* Área de conteúdo principal - responsiva */}
            <div style={{
                maxWidth: "1400px",
                margin: "0 auto",
                padding: windowWidth <= 480 ? "20px 16px" : windowWidth <= 768 ? "24px 20px" : "32px 40px"
            }}>
                {/* Grid de Estatísticas - cards com total de utilizadores, ativos, etc. */}
                <StatsGrid utilizadores={utilizadores} />

                {/* Card com tabela de utilizadores - gestão completa (editar/eliminar) */}
                <Card title="Lista de Utilizadores">
                    <UsersTable
                        utilizadores={utilizadores}
                        editandoUsuario={editandoUsuario}
                        dadosEdicao={dadosEdicao}
                        onDadosChange={setDadosEdicao}
                        onEdit={handleEditar}
                        onSave={handleGuardarEdicao}
                        onCancel={handleCancelarEdicao}
                        onDelete={handleEliminar}
                        currentUserEmail={user?.email}
                    />
                </Card>
            </div>

            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
        </div>
    );
}
