import React, { useState, useEffect } from "react";
import { Global } from "../../Router/Global";
import "./Cliente.css"; // Asegúrate de importar el archivo CSS
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

export const Cliente = ({usuarioObject}) => {
  const [clientes, setClientes] = useState([]);
  const [nuevoCliente, setNuevoCliente] = useState({
    dni: "",
    nombres: "",
    correo: "",
    tasaMoratoria:'',
    limiteCredito: '',
    fechaPagoMensual: "",
    Empresa_id:usuarioObject.Empresa_id
  });
  const [editingClientId, setEditingClientId] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Nuevo estado para controlar el modo de edición

  useEffect(() => {
    obtenerClientes();
  }, []);

  const obtenerClientes = async () => {
    try {
      const response = await fetch(Global.url + "clientes/clientes-por-usuario-empresa/"+usuarioObject.Empresa_id);
      const data = await response.json();
      setClientes(data);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };

  const cambiarModo = () => {
    setIsEditing(!isEditing); // Cambiar el estado de isEditing
    setEditingClientId(null); // Limpiar el cliente en edición
    setNuevoCliente({
      dni: "",
      nombres: "",
      correo: "",
      tasaMoratoria: '',
      limiteCredito: '',
      fechaPagoMensual: "",
      Empresa_id:usuarioObject.Empresa_id
    });
  };

  const crearCliente = async (e) => {
    e.preventDefault();
    try {
      if (editingClientId) {
        await fetch(Global.url + `clientes/${editingClientId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(nuevoCliente),
        });
        setEditingClientId(null);
        obtenerClientes();
      } else {
        await fetch(Global.url + "clientes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(nuevoCliente),
        });
        obtenerClientes();
        setNuevoCliente({
          dni: "",
          nombres: "",
          correo: "",
          tasaMoratoria: '',
          limiteCredito: '',
          fechaPagoMensual: "",
          Empresa_id:usuarioObject.Empresa_id
        });
      }
    } catch (error) {
      console.error("Error al crear cliente:", error);
    }
  };

  const eliminarCliente = async (id) => {
    try {
      await fetch(Global.url + `clientes/${id}`, {
        method: "DELETE",
      });
      obtenerClientes();
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
    }
  };

  const editarCliente = async (id) => {
    try {
      const response = await fetch(Global.url + `clientes/${id}`);
      const cliente = await response.json();

      // Formatear la fecha a "yyyy-MM-dd"
      const fechaFormateada = new Date(cliente.fechaPagoMensual)
        .toISOString()
        .split("T")[0];

      // Crear un nuevo objeto cliente con la fecha formateada
      const clienteEditado = { ...cliente, fechaPagoMensual: fechaFormateada };

      setNuevoCliente(clienteEditado);
      setEditingClientId(id);
      setIsEditing(true); // Cambiar a modo edición
    } catch (error) {
      console.error("Error al editar cliente:", error);
    }
  };

  return (
    <div className="cliente-container">
      <h2 className="cliente-heading">Clientes</h2>
      <div className="cliente-table-container">
        <table className="cliente-table">
          <thead>
            <tr>
              <th>DNI</th>
              <th>Nombres</th>
              <th>Correo</th>
              <th>Tasa Moratoria (no poner %)</th>
              <th>Límite Crédito</th>
              <th>Fecha Pago Mensual</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente._id}>
                <td>{cliente.dni}</td>
                <td>{cliente.nombres}</td>
                <td>{cliente.correo}</td>
                <td>{cliente.tasaMoratoria}</td>
                <td>{cliente.limiteCredito}</td>
                <td>{cliente.fechaPagoMensual}</td>
                <td className="cliente-actions">
                  <button
                    onClick={() => eliminarCliente(cliente._id)}
                    className="cliente-button cliente-delete"
                  >
                    <FontAwesomeIcon icon={faTrashAlt} className="faTrashAlt" />
                  </button>
                  <button
                    onClick={() => editarCliente(cliente._id)}
                    className="cliente-button cliente-edit"
                  >
                    <FontAwesomeIcon icon={faEdit} className="faEdit" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2 className="cliente-heading">
        {isEditing ? "Editar Cliente" : "Crear Nuevo Cliente"}
      </h2>
      {isEditing && ( // Mostrar el botón de Cambiar Modo solo cuando estás en modo edición
        <button onClick={cambiarModo} className="cliente-button cliente-create">
          Crear Cliente
        </button>
      )}
      <form onSubmit={crearCliente} className="cliente-form">
        <input
          type="text"
          placeholder="DNI"
          value={nuevoCliente.dni}
          onChange={(e) =>
            setNuevoCliente({ ...nuevoCliente, dni: e.target.value })
          }
          className="cliente-input"
        />
        <input
          type="text"
          placeholder="Nombres"
          value={nuevoCliente.nombres}
          onChange={(e) =>
            setNuevoCliente({ ...nuevoCliente, nombres: e.target.value })
          }
          className="cliente-input"
        />
        <input
          type="email"
          placeholder="Correo"
          value={nuevoCliente.correo}
          onChange={(e) =>
            setNuevoCliente({ ...nuevoCliente, correo: e.target.value })
          }
          className="cliente-input"
        />
        <input
          type="number"
          placeholder="Tasa Moratoria(sin %)"
          value={nuevoCliente.tasaMoratoria}
          onChange={(e) =>
            setNuevoCliente({ ...nuevoCliente, tasaMoratoria: e.target.value })
          }
          className="cliente-input"
        />
        <input
          type="number"
          placeholder="Límite Crédito"
          value={nuevoCliente.limiteCredito}
          onChange={(e) =>
            setNuevoCliente({ ...nuevoCliente, limiteCredito: e.target.value })
          }
          className="cliente-input"
        />
        <input
          type="date"
          placeholder="Fecha Pago Mensual"
          value={nuevoCliente.fechaPagoMensual}
          onChange={(e) =>
            setNuevoCliente({
              ...nuevoCliente,
              fechaPagoMensual: e.target.value,
            })
          }
          className="cliente-input"
        />
        <button type="submit" className="cliente-button cliente-submit">
          {editingClientId ? "Actualizar Cliente" : "Crear Cliente"}
        </button>
      </form>
    </div>
  );
};