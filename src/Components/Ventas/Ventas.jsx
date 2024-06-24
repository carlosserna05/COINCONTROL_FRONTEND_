import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Global } from "../../Router/Global";
import "./Ventas.css"; // Asegúrate de importar el archivo CSS
import { NavLink } from "react-router-dom";

const Ventas = ({ usuarioObject }) => {
  const [clientes, setClientes] = useState([]);
  const [tiposCredito, setTiposCredito] = useState([]);
  const [tiposInteres, setTiposInteres] = useState([]);
  const [ventas, setVentas] = useState([]);

  const [ventaId, setVentaId] = useState(null); // Nuevo estado para almacenar el ID de la venta que se está editando
  const [nroVenta, setNroVenta] = useState("");
  const [montoTotal, setMontoTotal] = useState("");
  const [plazoGracia, setPlazoGracia] = useState("");
  const [Usuario_id, setUsuario_id] = useState("");
  const [fechaVenta, setFechaVenta] = useState("");
  const [Cliente_id, setCliente_id] = useState(null);
  const [cuotas, setCuotas] = useState("");
  const [estado, setEstado] = useState(false);
  const [FechaInicio, setFechaInicio] = useState("");
  const [FechaFin, setFechaFin] = useState("");
  const [TipoCredito_id, setTipoCredito_id] = useState(null);
  const [TipoInteres_id, setTipoInteres_id] = useState(null);
  const [tasaInteres, setTasaInteres] = useState("");
  const [monto, setMonto] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Estado para almacenar el mensaje de error

  const plazoGraciaRef = useRef(null);
  const cuotasRef = useRef(null);

  useEffect(() => {
    // Fetch clientes
    fetch(Global.url + "clientes/clientes-por-usuario-empresa/" + usuarioObject.Empresa_id)
      .then((response) => response.json())
      .then((data) => setClientes(data));

    // Fetch tipos de crédito
    fetch(Global.url + "tipocreditos")
      .then((response) => response.json())
      .then((data) => setTiposCredito(data));

      
    // Fetch tipos de interés
    fetch(Global.url + "tipointereses")
      .then((response) => response.json())
      .then((data) => setTiposInteres(data));

    // Fetch ventas
    fetch(Global.url + "ventas/por-empresa/" + usuarioObject._id)
      .then((response) => response.json())
      .then((data) => setVentas(data));
  }, [usuarioObject.Empresa_id, usuarioObject._id]);

  useEffect(() => {
    const plazoGraciaInput = plazoGraciaRef.current;
    const cuotasInput = cuotasRef.current;

    if (plazoGraciaInput && cuotasInput) {
      plazoGraciaInput.disabled = false;
      cuotasInput.disabled = false;
    }

    if (TipoCredito_id && TipoCredito_id.label === "Siguiente Fecha") {
      setPlazoGracia(0);
      setCuotas(1);
      if (plazoGraciaInput && cuotasInput) {
        plazoGraciaInput.value = '0';
        cuotasInput.value = '1';
        plazoGraciaInput.disabled = true;
        cuotasInput.disabled = true;
      }
    }
  }, [TipoCredito_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const venta = {
      nroVenta,
      montoTotal,
      plazoGracia,
      Usuario_id: usuarioObject._id,
      fechaVenta,
      Cliente_id: Cliente_id ? Cliente_id.value : null,
      cuotas,
      estado: true,
      FechaInicio,
      FechaFin,
      TipoCredito_id: TipoCredito_id ? TipoCredito_id.value : null,
      TipoInteres_id: TipoInteres_id ? TipoInteres_id.value : null,
      tasaInteres,
      monto,
    };

    try {
      let url = `${Global.url}ventas/`;
      let method = "POST";

      if (ventaId) {
        url = `${Global.url}ventas/${ventaId}`;
        method = "PUT";
      } else if (cuotas > 0) {
        url = `${Global.url}ventas/concuotas`;
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(venta),
      });

      const result = await response.json();

      if (response.ok) {
        alert(
          ventaId ? "Venta actualizada con éxito" : "Venta creada con éxito"
        );
        setVentaId(null); // Limpiar el estado de ventaId después de actualizar o crear
        fetchVentas(); // Refrescar la lista de ventas
        setErrorMessage(""); // Limpiar el mensaje de error
      } else {
        setErrorMessage(result.message || "Error al procesar la venta"); // Mostrar mensaje de error
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Error al conectar con el servidor");
    }
  };

  const fetchVentas = () => {
    fetch(Global.url + "ventas/por-empresa/" + usuarioObject._id)
      .then((response) => response.json())
      .then((data) => setVentas(data));
  };

  const handleEdit = (venta) => {
    setVentaId(venta._id);
    setNroVenta(venta.nroVenta);
    setMontoTotal(venta.montoTotal);
    setPlazoGracia(venta.plazoGracia);
    setUsuario_id(venta.Usuario_id);
    setFechaVenta(venta.fechaVenta);
    setCliente_id({
      value: venta.Cliente_id._id,
      label: venta.Cliente_id.nombres,
    });
    setCuotas(venta.cuotas);
    setEstado(true);
    setFechaInicio(venta.FechaInicio);
    setFechaFin(venta.FechaFin);
    setTipoCredito_id({
      value: venta.TipoCredito_id._id,
      label: venta.TipoCredito_id.nombre,
    });
    setTipoInteres_id({
      value: venta.TipoInteres_id._id,
      label: venta.TipoInteres_id.nombre,
    });
    setTasaInteres(venta.tasaInteres);
    setMonto(venta.monto);
  };

  const handleDelete = async (ventaId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta venta?")) {
      try {
        const response = await fetch(`${Global.url}ventas/${ventaId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("Venta eliminada con éxito");
          fetchVentas(); // Refrescar la lista de ventas
        } else {
          alert("Error al eliminar la venta");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error al conectar con el servidor");
      }
    }
  };

  return (
    <div className="ventas-container">
      <h2>Gestor de Ventas</h2>
      <form className="ventas-form" onSubmit={handleSubmit}>
        <div>
          <label>Nro Venta:</label>
          <input
            type="number"
            value={nroVenta}
            onChange={(e) => setNroVenta(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Monto Total:</label>
          <input
            type="number"
            value={montoTotal}
            onChange={(e) => setMontoTotal(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Plazo Gracia:</label>
          <input
            type="number"
            value={plazoGracia}
            onChange={(e) => setPlazoGracia(e.target.value)}
            required
            ref={plazoGraciaRef}
          />
        </div>
        <div>
          <label>Usuario ID:</label>
          <input
            type="text"
            disabled
            value={usuarioObject._id}
            onChange={(e) => setUsuario_id(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Fecha Venta:</label>
          <input
            type="date"
            value={fechaVenta}
            onChange={(e) => setFechaVenta(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Cliente:</label>
          <Select
            options={clientes.map((cliente) => ({
              value: cliente._id,
              label: cliente.nombres,
            }))}
            value={Cliente_id}
            onChange={setCliente_id}
            placeholder="Seleccione un cliente"
          />
        </div>
        <div>
          <label>Cuotas:</label>
          <input
            type="number"
            value={cuotas}
            onChange={(e) => setCuotas(e.target.value)}
            required
            ref={cuotasRef}
          />
        </div>
        <div>
          <label>Tipo Crédito:</label>
          <Select
            options={tiposCredito.map((tipo) => ({
              value: tipo._id,
              label: tipo.nombre,
            }))}
            value={TipoCredito_id}
            onChange={setTipoCredito_id}
            placeholder="Seleccione un tipo de crédito"
          />
        </div>
        <div>
          <label>Tipo Interés:</label>
          <Select
            options={tiposInteres.map((tipo) => ({
              value: tipo._id,
              label: tipo.nombre,
            }))}
            value={TipoInteres_id}
            onChange={setTipoInteres_id}
            placeholder="Seleccione un tipo de interés"
          />
        </div>
        <div>
          <label>Tasa Interés (no poner %):</label>
          <input
            type="number"
            step="0.01"
            value={tasaInteres}
            onChange={(e) => setTasaInteres(e.target.value)}
            required
          />
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Mostrar mensaje de error */}

        <button type="submit">
          {ventaId ? "Actualizar Venta" : "Crear Venta"}
        </button>
      </form>

      <h3>Lista de Ventas</h3>
      <table className="ventas-table">
        <thead>
          <tr>
            <th>Nro Venta</th>
            <th>Cliente</th>
            <th>Fecha Venta</th>
            <th>Monto Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(ventas) &&
            ventas.map((venta) => (
              <tr key={venta._id}>
                <td>{venta.nroVenta}</td>
                <td>{venta.Cliente_id?.nombres}</td>
                <td>{new Date(venta.fechaVenta).toLocaleDateString()}</td>
                <td>{venta.montoTotal}</td>
                <td>
                  <button onClick={() => handleEdit(venta)}>
                    <FontAwesomeIcon icon={faEdit} className="faEdit" />
                  </button>
                  <button onClick={() => handleDelete(venta._id)}>
                    <FontAwesomeIcon icon={faTrashAlt} className="faTrashAlt" />
                  </button>
                  <NavLink to={"/cuotas/venta/" + venta._id}>
                    <button>
                      <FontAwesomeIcon icon={faEye} className="faEYE" />
                    </button>
                  </NavLink>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Ventas;
