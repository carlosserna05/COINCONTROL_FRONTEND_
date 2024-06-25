import React from "react";
import "./Home.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPiggyBank, faChartLine, faFileAlt } from '@fortawesome/free-solid-svg-icons';

export const Home = () => {
  return (
    <div className="home-container">
      <h1>Bienvenid@ a COINCONTROL</h1>

      <section className="app-def">
        <h2>¿Que es COINCONTROL?</h2>
      
        <p>COINCONTROL es una aplicación web que permite a los usuarios llevar de forma permanente el control de cuenta corriente, mediante créditos otorgados por pequeños establecimientos.</p>
      
      </section>
      
      <figure>
        <img src="src/assets/finanzasimg.png" alt="" />
      </figure>
      

      <section className="info-section">
        <h2>Definiciones Generales y Conceptos Básicos</h2>
        <div className="info-grid">
          <div className="info-card">
            <FontAwesomeIcon icon={faPiggyBank} className="info-icon" />
            <h3>Control de Cuenta Corriente</h3>
            <p>Administrar y/o gestionar cuenta bancaria sobre diferentes movimientos financieros dentro de la cuenta.</p>
          </div>
          <div className="info-card">
            <FontAwesomeIcon icon={faChartLine} className="info-icon" />
            <h3>Créditos</h3>
            <p>Sumas de dinero ingresadas en una cuenta que se deben de cancelar en un lapso establecido.</p>
          </div>
          <div className="info-card">
            <FontAwesomeIcon icon={faFileAlt} className="info-icon" />
            <h3>Tasa de Interés</h3>
            <p>Rendimiento obtenido a causa de una inversión realizada, siendo considerado ganancia generada.</p>
          </div>
          {/* Repite los elementos de la grid para cada definición */}
        </div>
      </section>

      <section className="legal-section">
        <h2>Marco Legal y Teórico</h2>
        <div className="legal-content">
          <h3>Marco Legal:</h3>
          <ul>
            <li>
              <strong>Ley de Protección de Datos Personales (Ley Nº 29733):</strong> Esta ley regula el tratamiento de datos personales en Perú.
            </li>
            <li>
              <strong>Ley del Sistema Financiero y del Sistema de Seguros y Orgánica de la Superintendencia de Banca y Seguros (Ley Nº 26702):</strong> Regula el funcionamiento de las instituciones financieras en Perú.
            </li>
            {/* Agrega el resto de las leyes de la misma manera */}
          </ul>

          <h3>Marco Teórico:</h3>
          <p>
            Fórmulas 
            Método Francés Vencido Ordinario:
            Este método es una técnica común para la amortización de préstamos en el ámbito financiero.
          </p>

        </div>
      </section>
    </div>
  );
};
