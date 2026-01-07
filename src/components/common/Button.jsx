export default function Button({ 
    children, 
    onClick, 
    variant = "primary", 
    icon: Icon,
    fullWidth = false,
    type = "button"
}) {
    const styles = {
        primary: { bg: "#63b099", hover: "#52a088" },
        secondary: { bg: "#64748b", hover: "#475569" },
        danger: { bg: "#ef4444", hover: "#dc2626" },
        success: { bg: "#10b981", hover: "#059669" },
        light: { bg: "rgba(255,255,255,0.2)", hover: "rgba(255,255,255,0.3)" }
    };

    const variantStyle = styles[variant] || styles.primary;

    return (
        <button
            type={type}
            onClick={onClick}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px 24px',
                backgroundColor: variantStyle.bg,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '500',
                width: fullWidth ? '100%' : 'auto',
                transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = variantStyle.hover}
            onMouseLeave={(e) => e.target.style.backgroundColor = variantStyle.bg}
        >
            {Icon && <Icon size={18} />}
            {children}
        </button>
    );
}
