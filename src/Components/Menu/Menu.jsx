import React, { useState } from 'react';
import 'materialize-css/dist/css/materialize.min.css';
import { NavLink } from 'react-router-dom';
import './Menu.css';

function Menu() {
  const [sidebarDisplay, setSidebarDisplay] = useState('sidebarNO');
  const handleClick = () => {
    if (sidebarDisplay === 'sidebarNO') {
      setSidebarDisplay('sidebarYES');
    } else {
      setSidebarDisplay('sidebarNO');
    }
  };

  return (
    <div>
      <nav>
        <div className="nav-wrapper white">
          <a href="/#" className="brand-logo"><img src="https://www.lacocottesolidaire.fr/build/images/logo-brand.png" alt="logo" /></a>
          <a href="#navbar" data-target="mobile-demo" className="sidenav-trigger">
            <i className="material-icons icon-green" role="button" tabIndex={0} onClick={handleClick} onKeyDown={handleClick}>menu</i>
          </a>
          <ul className="right hide-on-med-and-down">
            <li><NavLink exact to="/">Accueil</NavLink></li>
            <li><NavLink exact to="/reservation">Réservation</NavLink></li>
            <li><NavLink exact to="/activities">Activités</NavLink></li>
            <li><NavLink exact to="/events">Evènements</NavLink></li>
            <li><NavLink exact to="/users">Adhérents</NavLink></li>
          </ul>
        </div>
      </nav>
      <ul className={sidebarDisplay} id="mobile-demo">
        <li><NavLink onClick={handleClick} exact to="/">Accueil</NavLink></li>
        <li><NavLink onClick={handleClick} exact to="/reservation">Réservation</NavLink></li>
        <li><NavLink onClick={handleClick} exact to="/activities">Activités</NavLink></li>
        <li><NavLink onClick={handleClick} exact to="/events">Evènements</NavLink></li>
        <li><NavLink onClick={handleClick} exact to="/users">Adhérents</NavLink></li>
      </ul>
    </div>
  );
}

export default Menu;
