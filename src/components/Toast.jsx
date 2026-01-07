import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

function Toast({ message, type = 'success', onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const isSuccess = type === 'success';

    return (
        <div style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 9999,
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            padding: '16px 20px',
            minWidth: '320px',
            maxWidth: '500px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            borderLeft: `4px solid ${isSuccess ? '#10b981' : '#ef4444'}`,
            animation: 'slideIn 0.3s ease-out'
        }}>
            {isSuccess ? (
                <CheckCircle size={24} style={{ color: '#10b981', flexShrink: 0 }} />
            ) : (
                <XCircle size={24} style={{ color: '#ef4444', flexShrink: 0 }} />
            )}
            
            <span style={{
                flex: 1,
                color: '#334155',
                fontSize: '15px',
                fontWeight: '500'
            }}>
                {message}
            </span>

            <button
                onClick={onClose}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    color: '#94a3b8'
                }}
            >
                <X size={18} />
            </button>

            <style>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
}

export default Toast;
