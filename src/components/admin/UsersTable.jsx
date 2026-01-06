import UserTableRow from './UserTableRow';
import UserTableRowEdit from './UserTableRowEdit';
import { useWindowSize } from '../../hooks/useWindowSize';

/**
 * Componente de Tabela de Utilizadores
 * 
 * Funcionalidades:
 * - Exibe lista de utilizadores em formato de tabela
 * - Suporta modo visualização e modo edição inline
 * - Responsiva com scroll horizontal em mobile
 * - Destaca utilizador atual com badge "Você"
 * 
 * Props:
 * - utilizadores: array de objetos de utilizador
 * - editandoUsuario: email do utilizador em edição (null se nenhum)
 * - dadosEdicao: dados temporários durante edição
 * - onDadosChange: callback para atualizar dados de edição
 * - onEdit: callback para ativar modo edição
 * - onSave: callback para guardar alterações
 * - onCancel: callback para cancelar edição
 * - onDelete: callback para eliminar utilizador
 * - currentUserEmail: email do utilizador atual (para destacar)
 */
export default function UsersTable({ 
    utilizadores, 
    editandoUsuario, 
    dadosEdicao,
    onDadosChange,
    onEdit, 
    onSave,
    onCancel,
    onDelete,
    currentUserEmail
}) {
    const { width: windowWidth } = useWindowSize();
    
    return (
        /* Container com scroll horizontal em mobile para tabelas largas */
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: windowWidth <= 768 ? "600px" : "auto" }}>
                {/* Cabeçalho da tabela */}
                <thead style={{ backgroundColor: "#f9fafb" }}>
                    <tr>
                        <th style={{
                            padding: "16px 24px",
                            textAlign: "left",
                            fontSize: "13px",
                            fontWeight: "600",
                            color: "#64748b",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px"
                        }}>Nome</th>
                        <th style={{
                            padding: "16px 24px",
                            textAlign: "left",
                            fontSize: "13px",
                            fontWeight: "600",
                            color: "#64748b",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px"
                        }}>Email</th>
                        <th style={{
                            padding: "16px 24px",
                            textAlign: "left",
                            fontSize: "13px",
                            fontWeight: "600",
                            color: "#64748b",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px"
                        }}>Papel</th>
                        <th style={{
                            padding: "16px 24px",
                            textAlign: "left",
                            fontSize: "13px",
                            fontWeight: "600",
                            color: "#64748b",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px"
                        }}>Estado</th>
                        <th style={{
                            padding: "16px 24px",
                            textAlign: "left",
                            fontSize: "13px",
                            fontWeight: "600",
                            color: "#64748b",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px"
                        }}>Criado em</th>
                        <th style={{
                            padding: "16px 24px",
                            textAlign: "left",
                            fontSize: "13px",
                            fontWeight: "600",
                            color: "#64748b",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px"
                        }}>Último Login</th>
                        <th style={{
                            padding: "16px 24px",
                            textAlign: "left",
                            fontSize: "13px",
                            fontWeight: "600",
                            color: "#64748b",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px"
                        }}>Ações</th>
                    </tr>
                </thead>
                {/* Corpo da tabela - alterna entre modo visualização e edição */}
                <tbody style={{ backgroundColor: "white" }}>
                    {utilizadores.map((utilizador, index) => {
                        const isEditing = editandoUsuario === utilizador.email;
                        const isCurrentUser = utilizador.email === currentUserEmail;

                        return isEditing ? (
                            /* Modo EDIÇÃO - linha editável com campos de input */
                            <UserTableRowEdit
                                key={index}
                                utilizador={utilizador}
                                dadosEdicao={dadosEdicao}
                                onDadosChange={onDadosChange}
                                onSave={onSave}
                                onCancel={onCancel}
                            />
                        ) : (
                            /* Modo VISUALIZAÇÃO - linha com dados e botões editar/eliminar */
                            <UserTableRow
                                key={index}
                                utilizador={utilizador}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                isCurrentUser={isCurrentUser}
                            />
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
