import Badge from '../common/Badge';
import IconButton from '../common/IconButton';
import { Save, X } from 'lucide-react';

/**
 * Componente de linha de utilizador em modo edição
 * 
 * Props:
 * - utilizador: objeto com dados originais do utilizador
 * - dadosEdicao: objeto com dados temporários durante edição (nome, email, password)
 * - onDadosChange: callback para atualizar dadosEdicao
 * - onSave: callback para guardar alterações
 * - onCancel: callback para cancelar edição
 */
export default function UserTableRowEdit({ 
    utilizador, 
    dadosEdicao, 
    onDadosChange, 
    onSave, 
    onCancel 
}) {
    return (
        <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
            {/* Campo de edição do nome */}
            <td style={{ padding: "16px 24px" }}>
                <input
                    type="text"
                    value={dadosEdicao.nome}
                    onChange={(e) => onDadosChange({ ...dadosEdicao, nome: e.target.value })}
                    style={{
                        width: "100%",
                        padding: "8px 12px",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "14px"
                    }}
                />
            </td>
            {/* Campo de edição do email */}
            <td style={{ padding: "16px 24px" }}>
                <input
                    type="email"
                    value={dadosEdicao.email}
                    onChange={(e) => onDadosChange({ ...dadosEdicao, email: e.target.value })}
                    style={{
                        width: "100%",
                        padding: "8px 12px",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "14px"
                    }}
                />
            </td>
            {/* Badge de tipo (Admin ou Utilizador) - não editável */}
            <td style={{ padding: "16px 24px" }}>
                <Badge variant={utilizador.email === 'admin@medcei.com' ? 'admin' : 'default'}>
                    {utilizador.email === 'admin@medcei.com' ? 'Admin' : 'Utilizador'}
                </Badge>
            </td>
            {/* Estado - sempre Ativo */}
            <td style={{ padding: "16px 24px" }}>
                <Badge variant="active">Ativo</Badge>
            </td>
            {/* Data de criação - não editável */}
            <td style={{ padding: "16px 24px", color: "#64748b", fontSize: "14px" }}>
                05/01/2026
            </td>
            {/* Último acesso - não editável */}
            <td style={{ padding: "16px 24px", color: "#64748b", fontSize: "14px" }}>
                05/01/2026
            </td>
            {/* Botões de ação: Guardar e Cancelar */}
            <td style={{ padding: "16px 24px" }}>
                <div style={{ display: "flex", gap: "8px" }}>
                    {/* Botão Guardar - persiste alterações */}
                    <IconButton
                        icon={Save}
                        variant="success"
                        onClick={() => onSave(utilizador.email)}
                        title="Guardar"
                    />
                    {/* Botão Cancelar - descarta alterações */}
                    <IconButton
                        icon={X}
                        variant="secondary"
                        onClick={onCancel}
                        title="Cancelar"
                    />
                </div>
            </td>
        </tr>
    );
}
