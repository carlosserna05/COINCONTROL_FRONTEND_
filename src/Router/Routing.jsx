import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  NavLink,
  useNavigate,
} from "react-router-dom";
import { Login } from "../Components/Login/Login";
import { Registro } from "../Components/Registro/Registro";
import "../Router/Routing.css";
import { Home } from "../Components/Inicio/Home";
import { Cliente } from "../Components/Cliente/Cliente";
import { Usuarios } from "../Components/Usuarios/Usuarios";
import { TipoCredito } from "../Components/TipoCredito/TipoCredito";
import { TipoInteres } from "../Components/TipoInteres/TipoInteres";
import "../Router/Routing.css";
import Ventas from "../Components/Ventas/Ventas";
import { Cuotas } from "../Components/Ventas/Cuotas/Cuotas";
import CuentaCorriente from "../Components/CuentaCorriente/CuentaCorriente";

export const Routing = () => {
  const [login, setLogin] = useState("false");
  const [usuarioObject, setUsuarioObject] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("loggedIn") == "true") {
      setLogin(localStorage.getItem("loggedIn"));
    }
    if (localStorage.getItem("loggedIn_user")) {
      setUsuarioObject(JSON.parse(localStorage.getItem("loggedIn_user")));
    }
    if (login == "true") {
      navigate("/home");
    }
    console.log(login);
  }, [login]);

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("loggedIn_user");
    setLogin("false");
    navigate("/login");
  };

  return (
    <div>
      {login == "false" ? (
        <>
          <header id="nav">
            <ul>
            <NavLink to={"/login"}>Iniciar Sesión</NavLink>
            </ul>
          </header>
          <div id="layout">
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route
                path="/login"
                element={
                  <Login
                    setLogin={setLogin}
                    setUsuarioObject={setUsuarioObject}
                  />
                }
              />
              <Route path="/registro" element={<Registro />} />
            </Routes>
          </div>
        </>
      ) : (
        <>
          <header id="nav">
            <ul>
              <li onClick={handleLogout} className="logout-button">
                Cerrar Sesión
              </li>
              <NavLink to={"/home"}>Inicio</NavLink>
              <NavLink to={"/usuarios"}>Usuarios</NavLink>
              <NavLink to={"/clientes"}>Clientes</NavLink>
              <NavLink to={"/tiposdecredito"}>Tipos de Crédito</NavLink>
              <NavLink to={"/tiposdeinteres"}>Tipos de Interés</NavLink>
              <NavLink to={"/ventas"}>Ventas</NavLink>
              <NavLink to={"/cuenta"}>Cuenta Corriente</NavLink>

            </ul>
          </header>
          <div id="layout">
            <Routes>
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home" element={<Home />} />
              <Route
                path="/usuarios"
                element={<Usuarios usuarioObject={usuarioObject} />}
              />
              <Route path="/clientes" element={<Cliente usuarioObject={usuarioObject} />} />
              <Route path="/tiposdecredito" element={<TipoCredito />} />
              <Route path="/tiposdeinteres" element={<TipoInteres />} />
              <Route path="/ventas" element={<Ventas usuarioObject={usuarioObject} />} />
              <Route path="/cuotas/venta/:ventaId" element ={<Cuotas usuarioObject={usuarioObject}/>} />
              <Route path="/cuenta" element ={<CuentaCorriente usuarioObject={usuarioObject}/>} />
            </Routes>
          </div>
        </>
      )}
    </div>
  );
};
