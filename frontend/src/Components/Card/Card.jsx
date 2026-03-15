import "./Card.css"

export default function Card( {titulo, saldo, onClick}){

    return(
        <div className={`card ${onClick ? "clickable" : ""}`} onClick={onClick}>
            <h3>{titulo}</h3>
            {saldo !== undefined && (
             <p className="saldo-chamativo">
            {saldo}
            </p>
            )}
        </div>
    );
}