
import React, { useState, useEffect } from "react";
import { Global } from "../../Router/Global";
import "./Usuarios.css"; // Asegúrate de importar el archivo CSS
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

export const Usuarios = ({ usuarioObject }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    user: "",
    pass: "",
    correo: "",
    Empresa_id: usuarioObject.Empresa_id,
  });
  const [editingUserId, setEditingUserId] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Nuevo estado para controlar el modo de edición

  useEffect(() => {
    obtenerUsuarios();
    console.log(usuarioObject);
  }, []);

  const obtenerUsuarios = async () => {
    try {
      const response = await fetch(Global.url + "usuarios/empresa/" + usuarioObject.Empresa_id);
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  const cambiarModo = () => {
    setIsEditing(!isEditing); // Cambiar el estado de isEditing
    setEditingUserId(null); // Limpiar el usuario en edición
    setNuevoUsuario({
      user: "",
      pass: "",
      correo: "",
      Empresa_id: usuarioObject.Empresa_id
    });
  };

  const crearUsuario = async (e) => {
    e.preventDefault();
    console.log(nuevoUsuario);
    try {
      if (editingUserId) {
        await fetch(Global.url + `usuarios/${editingUserId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(nuevoUsuario),
        });
        setEditingUserId(null);
        obtenerUsuarios();
      } else {
        const response = await fetch(Global.url + "usuarios", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(nuevoUsuario),
        });
        const data = await response.json();
        setUsuarios([...usuarios, data]);
        setNuevoUsuario({
          user: "",
          pass: "",
          correo: "",
          Empresa_id: usuarioObject.Empresa_id,
        });
      }
    } catch (error) {
      console.error("Error al crear usuario:", error);
    }
  };

  const eliminarUsuario = async (id) => {
    try {
      await fetch(Global.url + `usuarios/${id}`, {
        method: "DELETE",
      });
      setUsuarios(usuarios.filter((usuario) => usuario._id !== id));
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  const editarUsuario = async (id) => {
    try {
      const response = await fetch(Global.url + `usuarios/${id}`);
      const usuario = await response.json();
      setNuevoUsuario(usuario);
      setEditingUserId(id);
      setIsEditing(true); // Cambiar a modo edición
    } catch (error) {
      console.error("Error al editar usuario:", error);
    }
  };

  return (
    <div className="usuarios-container">
      <h2 className="usuarios-heading">
        {isEditing ? "Editar Usuario" : "Crear Nuevo Usuario"}
      </h2>
      {isEditing && ( // Mostrar el botón de Cambiar Modo solo cuando estás en modo edición
        <button onClick={cambiarModo} className="usuarios-button usuarios-create">
          Crear Usuario
        </button>
      )}
      <form onSubmit={crearUsuario} className="usuarios-form">
        <input
          type="text"
          placeholder="User"
          value={nuevoUsuario.user}
          onChange={(e) =>
            setNuevoUsuario({ ...nuevoUsuario, user: e.target.value })
          }
          className="usuarios-input"
        />
        <input
          type="text"
          placeholder="Pass"
          value={nuevoUsuario.pass}
          onChange={(e) =>
            setNuevoUsuario({ ...nuevoUsuario, pass: e.target.value })
          }
          className="usuarios-input"
        />
        <input
          type="email"
          placeholder="Correo"
          value={nuevoUsuario.correo}
          onChange={(e) =>
            setNuevoUsuario({ ...nuevoUsuario, correo: e.target.value })
          }
          className="usuarios-input"
        />
        <input
          disabled
          type="text"
          placeholder="Empresa ID"
          value={usuarioObject.Empresa_id}
          onChange={(e) =>
            setNuevoUsuario({ ...nuevoUsuario, Empresa_id: e.target.value })
          }
          className="usuarios-input"
        />
        <button type="submit" className="usuarios-button usuarios-submit">
          {editingUserId ? "Actualizar Usuario" : "Crear Usuario"}
        </button>
      </form>

      <h2 className="usuarios-heading">Usuarios</h2>
      <div className="usuarios-table-container">
        <table className="usuarios-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Correo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario._id}>
                <td>{usuario.user}</td>
                <td>{usuario.correo}</td>
                <td className="usuarios-actions">
                  <button
                    className="usuarios-button usuarios-edit"
                    onClick={() => editarUsuario(usuario._id)}
                  >
                    <FontAwesomeIcon icon={faEdit} className="faEdit" />
                  </button>
                  <button
                    className="usuarios-button usuarios-delete"
                    onClick={() => eliminarUsuario(usuario._id)}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} className="faTrashAlt" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
