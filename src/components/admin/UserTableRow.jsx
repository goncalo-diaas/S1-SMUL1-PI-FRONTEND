import Badge from '../common/Badge';
import IconButton from '../common/IconButton';
import { Edit2, Trash2, Key } from 'lucide-react';

/**
 * Componente de linha de utilizador em modo visualização
 * 
 * Props:
 * - utilizador: objeto com dados do utilizador (nome, email)
 * - onEdit: callback para ativar modo edição
 * - onDelete: callback para eliminar utilizador
 * - onChangePassword: callback para alterar password do utilizador
 * - isCurrentUser: boolean indicando se é o utilizador atual (mostra badge "Você")
 */
export default function UserTableRow({ utilizador, onEdit, onDelete, onChangePassword, isCurrentUser }) {
    return (
        <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
            <td style={{ padding: "16px 24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{
                        color: "#1f2937",
                        fontSize: "14px",
                        fontWeight: "500"
                    }}>
                        {utilizador.nome}
                    </span>
                    {isCurrentUser && <Badge variant="you">Você</Badge>}
                </div>
            </td>
            <td style={{
                padding: "16px 24px",
                color: "#64748b",
                fontSize: "14px"
            }}>
                {utilizador.email}
            </td>
            <td style={{ padding: "16px 24px" }}>
                <Badge variant={utilizador.email === 'admin@medcei.com' ? 'admin' : 'default'}>
                    {utilizador.email === 'admin@medcei.com' ? 'Admin' : 'Utilizador'}
                </Badge>
            </td>
            <td style={{ padding: "16px 24px" }}>
                <Badge variant="active">Ativo</Badge>
            </td>
            <td style={{
                padding: "16px 24px",
                color: "#64748b",
                fontSize: "14px"
            }}>
                05/01/2026
            </td>
            <td style={{
                padding: "16px 24px",
                color: "#64748b",
                fontSize: "14px"
            }}>
                05/01/2026
            </td>
            <td style={{ padding: "16px 24px" }}>
                <div style={{ display: "flex", gap: "8px" }}>
                    {/* Botão Alterar Password - abre modal para definir nova password */}
                    <IconButton
                        icon={Key}
                        variant="warning"
                        onClick={() => onChangePassword(utilizador)}
                        title="Alterar Password"
                    />
                    {/* Botão Editar - ativa modo de edição inline */}
                    <IconButton
                        icon={Edit2}
                        variant="primary"
                        onClick={() => onEdit(utilizador)}
                        title="Editar"
                    />
                    {/* Botão Eliminar - remove utilizador (com confirmação no componente pai) */}
                    <IconButton
                        icon={Trash2}
                        variant="danger"
                        onClick={() => onDelete(utilizador.email)}
                        title="Eliminar"
                    />
                </div>
            </td>
        </tr>
    );
}
