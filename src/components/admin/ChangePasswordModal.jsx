import { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';

/**
 * Modal para Alteração de Password de Utilizador (Admin)
 * 
 * Funcionalidades:
 * - Modal overlay com fundo escuro semitransparente
 * - Formulário com nova password e confirmação
 * - Validação de password forte (min 8 caracteres)
 * - Validação de passwords coincidentes
 * - Botões de confirmar e cancelar
 * - Totalmente responsivo
 * 
 * Props:
 * - isOpen: boolean - controla visibilidade do modal
 * - onClose: function - callback para fechar modal
 * - onConfirm: function(newPassword) - callback ao confirmar com nova password
 * - userEmail: string - email do utilizador (para exibição)
 */
export default function ChangePasswordModal({ isOpen, onClose, onConfirm, userEmail }) {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    // Não renderiza nada se modal não estiver aberto
    if (!isOpen) return null;

    /**
     * Valida e submete nova password
     * 
     * Validações:
     * 1. Campos não podem estar vazios
     * 2. Password mínimo 8 caracteres
     * 3. Passwords devem coincidir
     */
    function handleSubmit(e) {
        e.preventDefault();
        setError('');

        // Validação 1: Campos obrigatórios
        if (!newPassword || !confirmPassword) {
            setError('Por favor, preencha todos os campos.');
            return;
        }

        // Validação 2: Password forte (mínimo 8 caracteres)
        if (newPassword.length < 8) {
            setError('A password deve ter pelo menos 8 caracteres.');
            return;
        }

        // Validação 3: Passwords devem coincidir
        if (newPassword !== confirmPassword) {
            setError('As passwords não coincidem.');
            return;
        }

        // Tudo validado: chama callback com nova password
        onConfirm(newPassword);
        
        // Limpa campos
        setNewPassword('');
        setConfirmPassword('');
        setError('');
    }

    /**
     * Fecha modal e limpa campos
     */
    function handleClose() {
        setNewPassword('');
        setConfirmPassword('');
        setError('');
        onClose();
    }

    return (
        /* Overlay - fundo escuro semitransparente */
        <div 
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                padding: '20px'
            }}
            onClick={handleClose} // Clique fora fecha modal
        >
            {/* Container do Modal */}
            <div 
                style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '32px',
                    maxWidth: '450px',
                    width: '100%',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                }}
                onClick={(e) => e.stopPropagation()} // Evita fechar ao clicar dentro
            >
                {/* Cabeçalho */}
                <div style={{ marginBottom: '24px' }}>
                    <h2 style={{ 
                        margin: '0 0 8px 0', 
                        color: '#63b099',
                        fontSize: '24px',
                        fontWeight: '600'
                    }}>
                        🔑 Alterar Password
                    </h2>
                    <p style={{ 
                        margin: 0, 
                        color: '#6b7280',
                        fontSize: '14px'
                    }}>
                        Definir nova password para: <strong>{userEmail}</strong>
                    </p>
                </div>

                {/* Formulário */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <Input
                        label="Nova Password"
                        type="password"
                        placeholder="Mínimo 8 caracteres"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        autoFocus
                    />

                    <Input
                        label="Confirmar Nova Password"
                        type="password"
                        placeholder="Digite novamente"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    {/* Mensagem de erro */}
                    {error && (
                        <div style={{
                            padding: '12px',
                            backgroundColor: '#fee2e2',
                            border: '1px solid #ef4444',
                            borderRadius: '8px',
                            color: '#dc2626',
                            fontSize: '14px'
                        }}>
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Informação de segurança */}
                    <div style={{
                        padding: '12px',
                        backgroundColor: '#dbeafe',
                        borderRadius: '8px',
                        fontSize: '13px',
                        color: '#1e40af'
                    }}>
                        ℹ️ <strong>Importante:</strong> O utilizador deverá ser informado da nova password por um canal seguro.
                    </div>

                    {/* Botões de ação */}
                    <div style={{ 
                        display: 'flex', 
                        gap: '12px',
                        marginTop: '8px'
                    }}>
                        <Button 
                            type="button" 
                            variant="secondary" 
                            onClick={handleClose}
                            fullWidth
                        >
                            Cancelar
                        </Button>
                        <Button 
                            type="submit" 
                            variant="primary"
                            fullWidth
                        >
                            Alterar Password
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
