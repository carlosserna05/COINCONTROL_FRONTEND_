import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Global } from "../../../Router/Global";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
  faMoneyBillWave,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./Cuotas.css"; // Asegúrate de que este archivo exista y tenga estilos

export const Cuotas = ({ usuarioObject }) => {
  const { ventaId } = useParams(); // Obtener el ventaId de los parámetros de la URL
  const [cuotas, setCuotas] = useState([]);
  const [diaFechaPagoMensual, setDiaFechaPagoMensual] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false); // Estado para manejar el popup
  const [selectedCuota, setSelectedCuota] = useState(null); // Estado para almacenar la cuota seleccionada
  const [pagosConDetalles, setPagosConDetalles] = useState([]); // Estado para almacenar los detalles de los pagos

  useEffect(() => {
    const fetchVentaYCuotas = async () => {
      try {
        const [ventaResponse, cuotasResponse] = await Promise.all([
          fetch(`${Global.url}ventas/${ventaId}`),
          fetch(`${Global.url}cuotas/venta/${ventaId}`),
        ]);

        if (!ventaResponse.ok) {
          throw new Error("Error fetching venta");
        }
        if (!cuotasResponse.ok) {
          throw new Error("Error fetching cuotas");
        }

        const ventaData = await ventaResponse.json();
        const cuotasData = await cuotasResponse.json();

        setCuotas(cuotasData);
        // Extraer el día de la fecha de pago mensual directamente de la cadena de fecha
        const fechaPagoMensualDia = ventaData.Cliente_id.fechaPagoMensual.slice(
          8,
          10
        );
        setDiaFechaPagoMensual(fechaPagoMensualDia); // Guardar el día de la fecha de pago mensual en el estado
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVentaYCuotas();
  }, [ventaId]);

  const fetchPagosConDetalles = async () => {
    try {
      const response = await fetch(`${Global.url}cuotas/pagos/detalles/${ventaId}`);
      if (!response.ok) {
        throw new Error("Error fetching pagos con detalles");
      }
      const data = await response.json();
      setPagosConDetalles(data);
    } catch (error) {
      console.error("Error fetching pagos con detalles:", error);
    }
  };

  useEffect(() => {
    fetchPagosConDetalles();
  }, [ventaId]);

  const handlePayCuota = async (cuota) => {
    try {
      const response = await fetch(`${Global.url}cuotas/pagar/${cuota._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pagado: true, usuarioObject, ventaId }),
      });

      if (response.ok) {
        alert("Cuota pagada con éxito");
        setCuotas(
          cuotas.map((c) => (c._id === cuota._id ? { ...c, pagado: true } : c))
        );
        setShowPopup(false);
        fetchPagosConDetalles(); // Actualizar pagos con detalles
      } else {
        alert("Error al pagar la cuota");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al conectar con el servidor");
    }
  };

  const generateAdvancedDetailsPDF = () => {
    const doc = new jsPDF("landscape");

    doc.text(`Codigo de venta: ${ventaId}`, 10, 10);
    doc.text(`Día de Pago Mensual: ${diaFechaPagoMensual}`, 10, 20);

    const tableColumn = [
      "Número de Cuota",
      "Monto",
      "Fecha de Pago",
      "Cliente ID",
      "DNI",
      "Nombres",
      "Correo",
      "Tasa de Moratoria",
      "Límite de Crédito",
      "Empresa ID"
    ];
    const tableRows = [];

    pagosConDetalles.forEach(pago => {
      const cliente = pago.cliente; // Cliente asociado al pago
      const rowData = [
        pago.numeroCuota,
        pago.monto,
        pago.fecha,
        cliente._id,
        cliente.dni,
        cliente.nombres,
        cliente.correo,
        cliente.tasaMoratoria,
        cliente.limiteCredito,
        cliente.Empresa_id
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 8, cellPadding: 2 },
      columnStyles: { 0: { cellWidth: 15 }, 1: { cellWidth: 20 }, 2: { cellWidth: 20 }, 3: { cellWidth: 20 }, 4: { cellWidth: 20 }, 5: { cellWidth: 20 }, 6: { cellWidth: 20 }, 7: { cellWidth: 20 }, 8: { cellWidth: 20 }, 9: { cellWidth: 20 }, 10: { cellWidth: 20 } },
      margin: { top: 20 },
      didDrawPage: function (data) {
        // Tu personalización de la página si es necesaria
      }
    });
    doc.save(`Detalles_Avanzados_Pagos_${ventaId}.pdf`);
  };


  const generatePDF = () => {
    const doc = new jsPDF();

    doc.text(`Codigo de venta: ${ventaId}`, 10, 10);
    doc.text(`Día de Pago Mensual: ${diaFechaPagoMensual}`, 10, 20);

    const tableColumn = [
      "Número de Cuota",
      "Monto",
      "Estado",
      "Mes",
      "Día de pago",
    ];
    const tableRows = [];

    cuotas.forEach((cuota) => {
      const cuotaData = [
        cuota.numeroCuota,
        cuota.monto,
        cuota.pagado ? "Pagado" : "No Pagado",
        cuota.mes,
        diaFechaPagoMensual,
      ];
      tableRows.push(cuotaData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      didDrawPage: function (data) {
        // Tu personalización de la página si es necesaria
      }
    });
    doc.save(`Detalles_Cuotas_${ventaId}.pdf`);
  };


  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="cuotas-container">
      <h2>Codigo de venta: {ventaId}</h2>
      <div>
        <h3>Día de Pago Mensual para el Cliente: {diaFechaPagoMensual}</h3>
      </div>
      <table className="cuotas-table">
        <thead>
          <tr>
            <th>Número de Cuota</th>
            <th>Monto</th>
            <th>Estado</th>
            <th>Mes</th>
            <th>Días Atrasado</th>
            <th>Monto Mora</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cuotas.map((cuota) => (
            <tr key={cuota._id}>
              <td>{cuota.numeroCuota}</td>
              <td>{cuota.monto}</td>
              <td>
                {cuota.pagado ? (
                  <FontAwesomeIcon icon={faCheckCircle} className="paid-icon" />
                ) : (
                  <FontAwesomeIcon
                    icon={faTimesCircle}
                    className="unpaid-icon"
                  />
                )}
              </td>
              <td>{cuota.mes}</td>
              <td>{cuota.diasAtrasado}</td>
              <td>{cuota.montoMora}</td>
              <td>
                {!cuota.pagado && (
                  <button
                    onClick={() => {
                      setSelectedCuota(cuota);
                      setShowPopup(true);
                    }}
                  >
                    <FontAwesomeIcon icon={faMoneyBillWave} /> Pagar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="pdf-button" onClick={generatePDF}>
        <FontAwesomeIcon icon={faFilePdf} /> Descargar Resumen de los Pagos
      </button>
      <button className="pdf-button" onClick={generateAdvancedDetailsPDF}>
        <FontAwesomeIcon icon={faFilePdf} /> Descargar Detalles Avanzados de los
        Pagos
      </button>

      {showPopup && selectedCuota && (
        <div className="popup">
          <div className="popup-inner">
            <h3>Confirmar Pago</h3>
            <p>
              ¿Deseas efecutar el pago de la cuota #{selectedCuota.numeroCuota} de{" "}
              {selectedCuota.monto} con mora de {selectedCuota.montoMora}?
            </p>
            <button onClick={() => handlePayCuota(selectedCuota)}>
              Confirmar
            </button>
            <button onClick={() => setShowPopup(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};
