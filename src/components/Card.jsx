function Card({ children }) {
    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            height: '100%',
            boxSizing: 'border-box'
        }}>
            {children}
        </div>
    );
}

export default Card;