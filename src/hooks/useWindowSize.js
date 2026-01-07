import { useState, useEffect } from 'react';

/**
 * Hook customizado useWindowSize
 * 
 * Propósito:
 * - Retorna o tamanho atual da janela de forma reativa
 * - Atualiza automaticamente quando a janela é redimensionada
 * - Resolve o problema de usar window.innerWidth diretamente (não reativo)
 * 
 * Utilização:
 * const { width, height } = useWindowSize();
 * 
 * Benefícios:
 * - Permite estilos responsivos que atualizam em tempo real
 * - Evita problemas de renderização ao redimensionar
 * - Centraliza lógica de responsividade
 * 
 * @returns {Object} { width: number, height: number }
 */
export function useWindowSize() {
    // Estado inicial com dimensões atuais da janela
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        // Função que atualiza o estado com novas dimensões
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        // Adiciona event listener para detetar redimensionamento
        window.addEventListener('resize', handleResize);
        
        // Cleanup: remove event listener quando componente desmonta
        return () => window.removeEventListener('resize', handleResize);
    }, []); // Array vazio = executa apenas uma vez (mount/unmount)

    return windowSize;
}
