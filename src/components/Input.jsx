function Input ({ label, type, placeholder, value, onChange }) {
    return (
        <div style={{ marginBottom: '15px', textAlign: 'left'}} >
            <label style = {{ display: 'block', marginBottom: '5px', fontSize: '1rem', fontWeight: 'bold', color: '#444' }} >
                {label}
            </label>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required
                style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    border: '1px solid #ddd',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                }}
            />
        </div>
    );
}
export default Input;