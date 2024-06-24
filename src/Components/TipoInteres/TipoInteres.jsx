import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPercentage } from '@fortawesome/free-solid-svg-icons';
import { Global } from "../../Router/Global";
import './TipoInteres.css';

export const TipoInteres = () => {
  const [tiposInteres, setTiposInteres] = useState([]);

  useEffect(() => {
    obtenerTiposInteres();
  }, []);

  const obtenerTiposInteres = async () => {
    try {
      const response = await fetch(Global.url + "tipointereses");
      const data = await response.json();
      setTiposInteres(data);
    } catch (error) {
      console.error("Error al obtener tipos de interés:", error);
    }
  };

  return (
    <div className="tipo-interes-container">
      <h2>Tipos de Interés</h2>
      <ul className="tipo-interes-list">
        {tiposInteres.map((tipo) => (
          <li key={tipo._id}>
            <FontAwesomeIcon icon={faPercentage} className="tipo-interes-icon" />
            {tipo.nombre}
          </li>
        ))}
      </ul>
    </div>
  );
};
