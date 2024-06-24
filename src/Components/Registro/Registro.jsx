import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Registro.css'; // Importa el archivo CSS
import { Global } from '../../Router/Global';

export const Registro = () => {
  const [empresa, setEmpresa] = useState({ nombre: '', ruc: '' });
  const [usuario, setUsuario] = useState({ user: '', pass: '', correo: '' });
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleEmpresaChange = (e) => {
    const { name, value } = e.target;
    setEmpresa({ ...empresa, [name]: value });
  };

  const handleUsuarioChange = (e) => {
    const { name, value } = e.target;
    setUsuario({ ...usuario, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Primero registra la empresa
      const empresaResponse = await fetch(Global.url+'empresas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(empresa),
      });
      const empresaData = await empresaResponse.json();

      // Luego registra el usuario
      const usuarioResponse = await fetch(Global.url+'usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...usuario, Empresa_id: empresaData._id }),
      });
      const usuarioData = await usuarioResponse.json();

      if (usuarioResponse.ok && empresaResponse.ok) {
        setMensaje('Registro exitoso. Redireccionando a login...');
        setTimeout(() => {
            navigate("/login");
        }, 2000);
      } else {
        setMensaje('Error en el registro, pruebe con otro nombre de usuario');
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      setMensaje('Error en el registro');
    }
  };

  return (
    <div className="registro-container-custom">
      <form onSubmit={handleSubmit} className="registro-form-custom">
        <h2>Registro</h2>
        <div className="form-group-custom">
          <h3>Datos de la Empresa</h3>
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={empresa.nombre}
            onChange={handleEmpresaChange}
            required
          />
          <label htmlFor="ruc">RUC</label>
          <input
            type="text"
            id="ruc"
            name="ruc"
            value={empresa.ruc}
            onChange={handleEmpresaChange}
            required
          />
        </div>
        <div className="form-group-custom">
          <h3>Datos del Usuario</h3>
          <label htmlFor="user">Usuario</label>
          <input
            type="text"
            id="user"
            name="user"
            value={usuario.user}
            onChange={handleUsuarioChange}
            required
          />
          <label htmlFor="pass">Contraseña</label>
          <input
            type="password"
            id="pass"
            name="pass"
            value={usuario.pass}
            onChange={handleUsuarioChange}
            required
          />
          <label htmlFor="correo">Correo</label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={usuario.correo}
            onChange={handleUsuarioChange}
            required
          />
        </div>
        <button type="submit" className="registro-button-custom">Registrar</button>
        {mensaje && <p className="mensaje-custom">{mensaje}</p>}
      </form>
    </div>
  );
};
