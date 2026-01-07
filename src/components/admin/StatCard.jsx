/**
 * Componente de Card de Estatística
 * 
 * Funcionalidades:
 * - Exibe uma métrica individual com ícone, valor e label
 * - Design minimalista com card branco e sombra suave
 * - Cor personalizável para ícone e valor
 * - Usado no painel admin para mostrar estatísticas do sistema
 * 
 * Estrutura:
 * - Ícone no topo (24px)
 * - Valor grande em negrito (32px)
 * - Label descritiva em cinza (14px)
 */
export default function StatCard({ icon: Icon, value, label, color }) {
    return (
        /* Card branco com bordas arredondadas e sombra */
        <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
            {/* Container do ícone - alinhado ao topo */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px'
            }}>
                <Icon size={24} style={{ color: color }} />
            </div>
            {/* Valor da estatística - número grande em destaque */}
            <div style={{
                fontSize: '32px',
                fontWeight: '700',
                color: color,
                marginBottom: '4px'
            }}>
                {value}
            </div>
            {/* Label descritiva - texto pequeno em cinza */}
            <p style={{ 
                margin: 0, 
                color: '#64748b', 
                fontSize: '14px' 
            }}>
                {label}
            </p>
        </div>
    );
}
