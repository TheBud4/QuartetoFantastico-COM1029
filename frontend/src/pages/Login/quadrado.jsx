import "./style.css";

function Quadrado(){

    const estiloQuadrado = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'rgba(255, 255, 255, 0.69)',
        height: '700px',
        width: '900px',
        borderRadius: '25px'
    };
    return (
        <div className="quadrado" style={estiloQuadrado}>
            <h1>Sistema Sanem</h1>
            <h2>Bem vindo!</h2>
        </div>
    );  
}

export default Quadrado;