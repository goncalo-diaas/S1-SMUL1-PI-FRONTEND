export default function Card({ title, children, padding = "24px" }) {
    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflow: 'hidden'
        }}>
            {title && (
                <div style={{
                    padding: padding,
                    borderBottom: '1px solid #e5e7eb'
                }}>
                    <h2 style={{
                        margin: 0,
                        fontSize: '20px',
                        fontWeight: '600',
                        color: '#63b099'
                    }}>
                        {title}
                    </h2>
                </div>
            )}
            <div style={{ padding: padding }}>
                {children}
            </div>
        </div>
    );
}
