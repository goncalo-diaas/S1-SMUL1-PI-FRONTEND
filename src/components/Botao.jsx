function Botao ({ texto, onClick, tipo = 'button' }) {
    return (
        <button
        type ={tipo}
        onClick={onClick}
        style={{
            width:'100%',
            padding: '16px',
            backgroundColor:'#599F86',
            color:'white',
            border:'none',
            borderRadius:'6px',
            fontSize:'16px',
            fontWeight:'bold',
            cursor:'pointer',
            marginTop:'10px'
        }}
        >
        {texto}
        </button>
    )
}
export default Botao;