import React, { useState, useEffect } from 'react';
import { Global } from '../../Router/Global';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleDown, faPrint } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './CuentaCorriente.css';

const CuentaCorriente = ({ usuarioObject }) => {
  const [cuentaCorriente, setCuentaCorriente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerCuentaCorriente = async () => {
      try {
        const response = await fetch(`${Global.url}cuentacorriente/empresa/${usuarioObject.Empresa_id}`);
        if (!response.ok) {
          throw new Error('No se pudo obtener la cuenta corriente');
        }
        const data = await response.json();
        setCuentaCorriente(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    obtenerCuentaCorriente();
  }, [usuarioObject]);

  const generarPDF = () => {
    if (!cuentaCorriente) return;
    const doc = new jsPDF();
    doc.text('Cuenta Corriente', 10, 10);
    doc.text('SALDO: ' + cuentaCorriente.saldo, 10, 20);

    doc.autoTable({
      head: [['Transacción', 'Tipo', 'Monto', 'Fecha', 'Cliente ID', 'Nombre Cliente', 'Correo Cliente']],
      body: cuentaCorriente.transacciones.map((transaccion, index) => [
        index + 1,
        transaccion.tipo,
        transaccion.monto,
        new Date(transaccion.fecha).toLocaleString(),
        transaccion.Cliente_id._id,
        transaccion.Cliente_id.nombres,
        transaccion.Cliente_id.correo
      ]),
      startY: 30
    });

    doc.save('CuentaCorriente.pdf');
  };

  if (loading) return <div className="cuenta-corriente-loading">Cargando...</div>;
  if (error) return <div className="cuenta-corriente-error">Error: {error}</div>;

  return (
    <div className="cuenta-corriente-container">
      <h2 className="cuenta-corriente-title">Cuenta Corriente</h2>
      {cuentaCorriente ? (
        <div className="cuenta-corriente-details">
          <p className="cuenta-corriente-saldo">Saldo: {cuentaCorriente.saldo}</p>
          <p className="cuenta-corriente-transacciones-title">Transacciones:</p>
          <table className="cuenta-corriente-table">
            <thead>
              <tr>
                <th>Transacción</th>
                <th>Tipo</th>
                <th>Monto</th>
                <th>Fecha</th>
                <th>Cliente ID</th>
                <th>Nombre Cliente</th>
                <th>Correo Cliente</th>
              </tr>
            </thead>
            <tbody>
              {cuentaCorriente.transacciones.map((transaccion, index) => (
                <tr key={index} className={transaccion.tipo === 'egreso' ? 'egreso' : 'ingreso'}>
                  <td>{index + 1}</td>
                  <td>{transaccion.tipo}</td>
                  <td>{transaccion.monto}</td>
                  <td>{new Date(transaccion.fecha).toLocaleString()}</td>
                  <td>{transaccion.Cliente_id._id}</td>
                  <td>{transaccion.Cliente_id.nombres}</td>
                  <td>{transaccion.Cliente_id.correo}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="pdf-button" onClick={generarPDF}>
            <FontAwesomeIcon icon={faArrowAltCircleDown} /> Descargar PDF
          </button>
        </div>
      ) : (
        <p className="cuenta-corriente-not-found">No se encontró la cuenta corriente</p>
      )}
    </div>
  );
};

export default CuentaCorriente;
