import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { useWindowSize } from "../hooks/useWindowSize";
import Toast from "../components/Toast";
import { User, Mail, Calendar, Shield, Edit2 } from "lucide-react";

/**
 * Página de Perfil do Utilizador
 * 
 * Funcionalidades:
 * - Visualização de informações pessoais (nome, email, tipo, data de registo)
 * - Edição de perfil (modo editar/visualizar)
 * - Estatísticas do utilizador:
 *   * Total de simulações realizadas
 *   * Simulações este mês
 *   * Data da última simulação
 * - Design responsivo com layout em grid (2 colunas desktop, 1 coluna mobile)
 * - Toast notifications para feedback
 * 
 * Estados:
 * - isEditing: modo de edição ativo/inativo
 * - user: dados atuais do utilizador
 * - tempUser: dados temporários durante edição (pode cancelar)
 * 
 * Fluxo:
 * 1. Carrega dados do utilizador autenticado (AuthContext)
 * 2. Calcula estatísticas a partir de simulações em localStorage
 * 3. Permite editar nome e email (botão Editar)
 * 4. Validação antes de guardar
 * 5. Pode cancelar edição (restaura valores originais)
 */
function Profile() {
    // Contexto de autenticação e hooks
    const { user: authUser } = useAuth();
    const { toast, showToast, hideToast } = useToast();
    const navigate = useNavigate();
    const { width: windowWidth } = useWindowSize();

    // Estado de edição (true = editando, false = visualizando)
    const [isEditing, setIsEditing] = useState(false);
    
    // Dados do utilizador (atualizados após guardar)
    const [user, setUser] = useState({
        nome: authUser?.nome || "",
        email: authUser?.email || "",
        tipo: authUser?.isAdmin ? "Administrador" : "Utilizador",
        membroDesde: "06/12/2025"
    });

    // Dados temporários durante edição (permite cancelar sem perder original)
    const [tempUser, setTempUser] = useState(user);

    /**
     * Ativa modo de edição
     * Copia dados atuais para tempUser (permite cancelar)
     */
    function handleEditar() {
        setTempUser(user);
        setIsEditing(true);
    }

    /**
     * Cancela edição
     * Restaura tempUser com dados originais e desativa modo edição
     */
    function handleCancelar() {
        setTempUser(user);
        setIsEditing(false);
    }

    /**
     * Guarda alterações do perfil
     * Validações:
     * - Nome não pode estar vazio
     * - Email não pode estar vazio
     * 
     * Se válido: atualiza user, desativa edição, mostra sucesso
     */
    function handleGuardar(e) {
        e.preventDefault();
        
        // Validação: campos não podem estar vazios
        if (!tempUser.nome.trim() || !tempUser.email.trim()) {
            showToast("Por favor, preencha todos os campos", "error");
            return;
        }

        // Atualiza dados permanentes e sai do modo edição
        setUser(tempUser);
        setIsEditing(false);
        showToast("Perfil atualizado com sucesso!", "success");
    }

    // Cálculo de estatísticas do utilizador
    // Busca todas as simulações no localStorage
    const simulacoesGuardadas = JSON.parse(localStorage.getItem('simulacoes') || '[]');
    
    // Filtra apenas simulações do utilizador atual (por email)
    const simulacoesDoUtilizador = simulacoesGuardadas.filter(sim => sim.utilizador === authUser?.email);
    
    // Estatísticas calculadas
    const stats = {
        totalSimulacoes: simulacoesDoUtilizador.length,
        esteMes: simulacoesDoUtilizador.length, // TODO: calcular apenas deste mês
        ultimaSimulacao: simulacoesDoUtilizador.length > 0 
            ? simulacoesDoUtilizador[0].data 
            : 'Nenhuma'
    };

    return (
        /* Container principal com navbar fixa no topo */
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingTop: '90px' }}>
            <Navbar nome={user.nome} />

            {/* Header da página - fundo verde com título e ícone */}
            <div style={{
                backgroundColor: '#63b099',
                color: 'white',
                padding: '40px'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <User size={32} />
                        <div>
                            <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: '600' }}>
                                Meu Perfil
                            </h1>
                            <p style={{ margin: 0, fontSize: '15px', opacity: 0.9 }}>
                                Configure as suas informações pessoais
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Conteúdo principal - grid responsivo (2 colunas desktop, 1 coluna mobile) */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: windowWidth <= 480 ? '20px 16px' : '40px 20px' }}>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: windowWidth <= 768 ? '1fr' : '2fr 1fr', // 2 colunas desktop, 1 mobile
                    gap: '24px' 
                }}>
                    {/* Card de Informações Pessoais - lado esquerdo ou topo em mobile */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: windowWidth <= 480 ? '20px' : '32px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                    }}>
                        {/* Título do card com botão Editar (se não estiver editando) */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ margin: 0, color: '#63b099', fontSize: '20px', fontWeight: '600' }}>
                                Informações Pessoais
                            </h2>
                            {/* Botão Editar - apenas visível quando não está em modo edição */}
                            {!isEditing && (
                                <button
                                    onClick={handleEditar}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '8px 16px',
                                        backgroundColor: '#63b099',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        transition: 'background-color 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#52a088'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#63b099'}
                                >
                                    <Edit2 size={16} />
                                    Editar
                                </button>
                            )}
                        </div>

                        {/* Conteúdo condicional: formulário de edição ou visualização */}
                        {isEditing ? (
                            /* Modo EDIÇÃO - formulário com campos editáveis */
                            <form onSubmit={handleGuardar} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {/* Campo de edição de nome */}
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', color: '#64748b', fontSize: '14px', fontWeight: '500' }}>
                                        Nome Completo
                                    </label>
                                    <input
                                        type="text"
                                        value={tempUser.nome}
                                        onChange={(e) => setTempUser({ ...tempUser, nome: e.target.value })} // Atualiza tempUser
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '8px',
                                            fontSize: '15px',
                                            outline: 'none',
                                            transition: 'border-color 0.2s'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#63b099'}
                                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                        required
                                    />
                                </div>

                                {/* Campo de edição de email */}
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', color: '#64748b', fontSize: '14px', fontWeight: '500' }}>
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={tempUser.email}
                                        onChange={(e) => setTempUser({ ...tempUser, email: e.target.value })} // Atualiza tempUser
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '8px',
                                            fontSize: '15px',
                                            outline: 'none',
                                            transition: 'border-color 0.2s'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#63b099'}
                                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                        required
                                    />
                                </div>

                                {/* Botões de ação - Guardar e Cancelar */}
                                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                    {/* Botão Guardar - submit do formulário */}
                                    <button
                                        type="submit"
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            backgroundColor: '#10b981',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '15px',
                                            fontWeight: '500',
                                            transition: 'background-color 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                                    >
                                        Guardar
                                    </button>
                                    {/* Botão Cancelar - restaura valores originais e sai do modo edição */}
                                    <button
                                        type="button"
                                        onClick={handleCancelar}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            backgroundColor: '#64748b',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '15px',
                                            fontWeight: '500',
                                            transition: 'background-color 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#475569'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#64748b'}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        ) : (
                            /* Modo VISUALIZAÇÃO - cards com informações apenas para leitura */
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {/* Card de Nome */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                                    <User size={24} style={{ color: '#63b099', flexShrink: 0 }} />
                                    <div>
                                        <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Nome Completo</p>
                                        <p style={{ margin: '4px 0 0 0', fontSize: '16px', fontWeight: '500', color: '#1e293b' }}>
                                            {user.nome}
                                        </p>
                                    </div>
                                </div>

                                {/* Card de Email */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                                    <Mail size={24} style={{ color: '#63b099', flexShrink: 0 }} />
                                    <div>
                                        <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Email</p>
                                        <p style={{ margin: '4px 0 0 0', fontSize: '16px', fontWeight: '500', color: '#1e293b' }}>
                                            {user.email}
                                        </p>
                                    </div>
                                </div>

                                {/* Card de Tipo de Conta */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                                    <Shield size={24} style={{ color: '#63b099', flexShrink: 0 }} />
                                    <div>
                                        <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Tipo de Conta</p>
                                        <p style={{ margin: '4px 0 0 0', fontSize: '16px', fontWeight: '500', color: '#1e293b' }}>
                                            {user.tipo}
                                        </p>
                                    </div>
                                </div>

                                {/* Card de Data de Registo */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                                    <Calendar size={24} style={{ color: '#63b099', flexShrink: 0 }} />
                                    <div>
                                        <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Membro desde</p>
                                        <p style={{ margin: '4px 0 0 0', fontSize: '16px', fontWeight: '500', color: '#1e293b' }}>
                                            {user.membroDesde}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Card de Estatísticas - lado direito ou abaixo em mobile */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: windowWidth <= 480 ? '20px' : '32px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        height: 'fit-content' // Ajusta altura ao conteúdo
                    }}>
                        <h3 style={{ margin: '0 0 24px 0', color: '#63b099', fontSize: '20px', fontWeight: '600' }}>
                            Estatísticas
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {/* Total de Simulações - extraído de localStorage */}
                            <div style={{ textAlign: 'center', padding: '24px', backgroundColor: '#f0fdf4', borderRadius: '8px' }}>
                                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#63b099', marginBottom: '8px' }}>
                                    {stats.totalSimulacoes}
                                </div>
                                <p style={{ margin: 0, fontSize: '14px', color: '#64748b', fontWeight: '500' }}>
                                    Simulações Total
                                </p>
                            </div>

                            {/* Simulações Este Mês - atualmente igual ao total (TODO: filtrar por mês) */}
                            <div style={{ textAlign: 'center', padding: '24px', backgroundColor: '#eff6ff', borderRadius: '8px' }}>
                                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '8px' }}>
                                    {stats.esteMes}
                                </div>
                                <p style={{ margin: 0, fontSize: '14px', color: '#64748b', fontWeight: '500' }}>
                                    Este Mês
                                </p>
                            </div>

                            {/* Data da Última Simulação - primeira simulação do array (mais recente) */}
                            <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                                <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#64748b' }}>
                                    Última Simulação
                                </p>
                                <p style={{ margin: 0, fontSize: '16px', fontWeight: '500', color: '#1e293b' }}>
                                    {stats.ultimaSimulacao}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast de notificação - feedback de ações (guardar, erro) */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
        </div>
    );
}

export default Profile;
