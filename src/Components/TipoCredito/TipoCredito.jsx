import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { Global } from '../../Router/Global';
import './TipoCredito.css';

export const TipoCredito = () => {
  const [tiposCredito, setTiposCredito] = useState([]);

  useEffect(() => {
    obtenerTiposCredito();
  }, []);

  const obtenerTiposCredito = async () => {
    try {
      const response = await fetch(Global.url + 'tipocreditos');
      const data = await response.json();
      setTiposCredito(data);
    } catch (error) {
      console.error('Error al obtener tipos de crédito:', error);
    }
  };

  return (
    <div className="tipo-credito-container">
      <h2>Tipos de Crédito</h2>
      <ul className="tipo-credito-list">
        {tiposCredito.map((tipo) => (
          <li key={tipo._id}>
            <FontAwesomeIcon icon={faCreditCard} className="tipo-credito-icon" />
            {tipo.nombre}
          </li>
        ))}
      </ul>
    </div>
  );
};
