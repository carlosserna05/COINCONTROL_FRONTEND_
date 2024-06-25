import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faSignInAlt, faUserPlus, faInfoCircle, faCreditCard, faPercentage, faFileInvoiceDollar, faUniversity, faShieldAlt, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';
import './Login.css';
import { Global } from '../../Router/Global';

export const Login = ({ setLogin, setUsuarioObject }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${Global.url}usuarios/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user, pass }),
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('loggedIn_user', JSON.stringify(data.usuario));
        setLogin('true');
        setUsuarioObject(data.usuario);
        alert('Login exitoso');
        console.log(data.usuario);
      } else {
        alert('Usuario o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="info-container">
        <h1>Trabajo Final - Finanzas e Ingeniería Económica</h1>
        <div className="participants-container">
          <div className="participants-list-container">
            <h2>Integrantes</h2>
            <ul className="participants-list">
              <li><strong>- Mallma Espiritu, Franky Oswald</strong> - U20211C250</li>
              <li><strong>- Monasca Tolentino, Jesús Abel</strong> - U20201B337</li>
              <li><strong>- Panduro Rodriguez, Ivana</strong> - U20201C143</li>
              <li><strong>- Leon Asencios, Carlos Rodrigo</strong> - U202112351</li>
              <li><strong>- Serna Ventura, Carlos Alejandro</strong> - U202113516</li>
            </ul>
          </div>
          <img className='participants-image' src='https://i.pinimg.com/originals/ef/a6/6d/efa66d84d8dfcefa527359ab296cc5b5.jpg' alt='Logo'></img>
        </div>

        <h2><FontAwesomeIcon icon={faInfoCircle} /> Información Importante</h2>
        <ul className="info-list">
          <li><FontAwesomeIcon icon={faCreditCard} /> <strong>Control de cuenta corriente: </strong> Administrar y/o gestionar cuenta bancaria sobre diferentes movimientos financieros dentro de la cuenta.</li>
          <li><FontAwesomeIcon icon={faMoneyBillWave} /> <strong>Créditos: </strong> Sumas de dinero ingresadas en una cuenta que se deben de cancelar en un lapso establecido.</li>
          <li><FontAwesomeIcon icon={faPercentage} /> <strong>Tasa de interés: </strong> Rendimiento obtenido a causa de una inversión realizada, siendo considerado ganancia generada.</li>
          <li><FontAwesomeIcon icon={faPercentage} /> <strong>Tasa efectiva periódica: </strong> Tasa que actúa sobre el capital de la operación financiera.</li>
          <li><FontAwesomeIcon icon={faPercentage} /> <strong>Tasa nominal periódica: </strong> Tasa anunciada en una inversión, teniendo en cuenta el lapso de tiempo establecido, y la capitalización determinada.</li>
          <li><FontAwesomeIcon icon={faFileInvoiceDollar} /> <strong>Reportes de saldos en cuenta: </strong> Documentos detallados sobre lo relacionado con los movimientos financieros de una cuenta corriente, con la finalidad de gestionar las finanzas.</li>
          <li><FontAwesomeIcon icon={faMoneyBillWave} /> <strong>Capital: </strong> Valor actual del dinero, inversión inicial, etc.</li>
          <li><FontAwesomeIcon icon={faCreditCard} /> <strong>Bono: </strong> Instrumento financiero de deuda emitido por una entidad, con la finalidad de brindar un activo financiero al prestamista.</li>
          <li><FontAwesomeIcon icon={faPercentage} /> <strong>Tasa de Costo Efectiva Anual (TCEA): </strong> Tasa que incluye lo involucrado que se paga por un crédito. Compuesta por la tasa efectiva anual, cargos mensuales y cargo cobrado según la entidad financiera.</li>
          <li><FontAwesomeIcon icon={faPercentage} /> <strong>Tasa de Rendimiento Efectiva Anual (TREA): </strong> Tasa orientada a comparar el rendimiento total de un producto pasivo.</li>
          <li><FontAwesomeIcon icon={faShieldAlt} /> <strong>Periodo de gracia: </strong> Lapso de tiempo desde el inicio del servicio del crédito que se genera, en el que el deudor no abona los intereses ni capital correspondientes a devolver, siendo generados estos intereses después de aquel periodo de tiempo.</li>
          <li><FontAwesomeIcon icon={faUniversity} /> <strong>Flujo de caja: </strong> Movimiento de dinero en efectivo que ingresa y sale del negocio en un tiempo determinado. Herramienta ideal para la medición del nivel de liquidez de una empresa.</li>
          <li><FontAwesomeIcon icon={faUniversity} /> <strong>Mercado financiero: </strong> Ambientes en el que se realizan intercambios de activos financieros, siendo los principales involucrados en estos procesos los agentes económicos. Este espacio está bajo la ley de la oferta y la demanda, siendo un mercado cambiante según se requiera.</li>
          <li><FontAwesomeIcon icon={faUniversity} /> <strong>Superintendencia de Banca, Seguros y AFP (SBS): </strong> Organismo encargado sobre la regulación y supervisión de los sistemas financieros. El principal objetivo es el de preservar los intereses de los depositantes y asegurados involucrados.</li>
        </ul>
      </div>
      <form onSubmit={handleSubmit} className="login-form">
        <h2><FontAwesomeIcon icon={faSignInAlt} /> Iniciar Sesión</h2>
        <div className="form-group">
          <label htmlFor="user"><FontAwesomeIcon icon={faUser} /> Usuario</label>
          <input
            type="text"
            id="user"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="pass"><FontAwesomeIcon icon={faLock} /> Contraseña</label>
          <input
            type="password"
            id="pass"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button"><FontAwesomeIcon icon={faSignInAlt} /> Iniciar Sesión</button>
        <NavLink to="/registro">
          <button type="button" className="register-button"><FontAwesomeIcon icon={faUserPlus} /> Registrarse</button>
        </NavLink>
      </form>
    </div>
  );
};
