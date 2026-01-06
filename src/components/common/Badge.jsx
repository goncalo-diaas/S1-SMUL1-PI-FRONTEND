export default function Badge({ children, variant = "default" }) {
    const styles = {
        default: { bg: "#f3f4f6", color: "#4b5563" },
        admin: { bg: "#dbeafe", color: "#1e40af" },
        active: { bg: "#d1fae5", color: "#065f46" },
        inactive: { bg: "#fee2e2", color: "#991b1b" },
        you: { bg: "#dbeafe", color: "#1e40af" }
    };

    const variantStyle = styles[variant] || styles.default;

    return (
        <span style={{
            display: 'inline-block',
            padding: variant === 'you' ? '2px 8px' : '4px 12px',
            borderRadius: '12px',
            fontSize: variant === 'you' ? '11px' : '13px',
            fontWeight: variant === 'you' ? '600' : '500',
            backgroundColor: variantStyle.bg,
            color: variantStyle.color
        }}>
            {children}
        </span>
    );
}
