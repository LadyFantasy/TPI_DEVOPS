import React from "react";
import "./../styles/Footer.css"; // Crearemos este archivo de estilos

function Footer() {
  const repositoryUrl = "https://github.com/LadyFantasy/ProyectoPPIV_Front/";

  return (
    <footer className="footer__wrapper">
      <a href={repositoryUrl} target="_blank" rel="noopener noreferrer" className="footer__link">
        Ver Repositorio en GitHub
      </a>
    </footer>
  );
}

export default Footer;
