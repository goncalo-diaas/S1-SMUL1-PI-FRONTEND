export default function IconButton({ 
    icon: Icon, 
    onClick, 
    variant = "primary", 
    title,
    disabled = false
}) {
    const styles = {
        primary: { bg: "#63b099", hover: "#52a088" },
        danger: { bg: "#ef4444", hover: "#dc2626" },
        success: { bg: "#10b981", hover: "#059669" },
        secondary: { bg: "#6b7280", hover: "#4b5563" }
    };

    const variantStyle = styles[variant] || styles.primary;

    return (
        <button
            onClick={onClick}
            title={title}
            disabled={disabled}
            style={{
                padding: '8px',
                backgroundColor: disabled ? '#d1d5db' : variantStyle.bg,
                border: 'none',
                borderRadius: '6px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                transition: 'background-color 0.2s',
                opacity: disabled ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
                if (!disabled) {
                    e.target.style.backgroundColor = variantStyle.hover;
                }
            }}
            onMouseLeave={(e) => {
                if (!disabled) {
                    e.target.style.backgroundColor = variantStyle.bg;
                }
            }}
        >
            <Icon size={18} />
        </button>
    );
}
