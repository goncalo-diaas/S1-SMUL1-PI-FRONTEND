import StatCard from './StatCard';
import { Users, UserCheck, Shield } from 'lucide-react';
import { useWindowSize } from '../../hooks/useWindowSize';

/**
 * Componente de Grid de Estatísticas do Painel Admin
 * 
 * Funcionalidades:
 * - Exibe 4 cards com estatísticas do sistema
 * - Calcula estatísticas em tempo real a partir do array de utilizadores
 * - Layout responsivo em grid:
 *   * Desktop (>768px): 4 colunas
 *   * Tablet (480-768px): 2 colunas
 *   * Mobile (≤480px): 1 coluna
 * 
 * Estatísticas exibidas:
 * - Total de Utilizadores: contagem total
 * - Utilizadores Ativos: todos os utilizadores (100% ativos por padrão)
 * - Administradores: utilizadores com email admin@medcei.com
 * - Utilizadores Comuns: utilizadores não-admin
 */
export default function StatsGrid({ utilizadores }) {
    const { width: windowWidth } = useWindowSize();
    
    // Cálculo de estatísticas a partir do array de utilizadores
    const stats = {
        total: utilizadores.length, // Total de utilizadores registados
        active: utilizadores.length, // Todos considerados ativos (sem sistema de sessões)
        admins: utilizadores.filter(u => u.email === 'admin@medcei.com').length, // Conta admins
        users: utilizadores.filter(u => u.email !== 'admin@medcei.com').length // Conta utilizadores comuns
    };

    return (
        /* Grid responsivo de cards de estatísticas */
        <div style={{
            display: 'grid',
            gridTemplateColumns: windowWidth <= 480 ? '1fr' : windowWidth <= 768 ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: '20px',
            marginBottom: '32px'
        }}>
            {/* Card 1: Total de Utilizadores */}
            <StatCard
                icon={Users}
                value={stats.total}
                label="Total de Utilizadores"
                color="#64748b"
            />
            {/* Card 2: Utilizadores Ativos (100% por padrão) */}
            <StatCard
                icon={UserCheck}
                value={stats.active}
                label="Utilizadores Ativos"
                color="#10b981"
            />
            {/* Card 3: Administradores */}
            <StatCard
                icon={Shield}
                value={stats.admins}
                label="Administradores"
                color="#3b82f6"
            />
            {/* Card 4: Utilizadores Comuns (não-admin) */}
            <StatCard
                icon={Users}
                value={stats.users}
                label="Utilizadores Comuns"
                color="#8b5cf6"
            />
        </div>
    );
}
