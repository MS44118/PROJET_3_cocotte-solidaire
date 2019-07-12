import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

// CSS
import 'materialize-css/dist/css/materialize.min.css';
import './Menu.css';

// ACTIONS
import { tokenApprovedFalseAction } from '../../Actions/tokenAction';

function Menu({ dispatch }) {
  const [sidebarDisplay, setSidebarDisplay] = useState('sidebarNO');

  const handleClick = () => {
    if (sidebarDisplay === 'sidebarNO') {
      setSidebarDisplay('sidebarYES');
    } else {
      setSidebarDisplay('sidebarNO');
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('id_token');
    dispatch(tokenApprovedFalseAction());
  };

  return (
    <div>
      <nav>
        <div className="nav-wrapper white">
          <a href="/#" className="brand-logo"><img src="https://www.lacocottesolidaire.fr/build/images/logo-brand.png" alt="logo" /></a>
          <a href="#navbar" data-target="mobile-demo" className="sidenav-trigger">
            <i className="material-icons icon-green" role="button" tabIndex={0} onClick={handleClick} onKeyDown={handleClick}>menu</i>
          </a>
          <ul className="right hide-on-med-and-down" style={{ display: 'flex', alignItems: 'center' }}>
            <li><NavLink exact to="/">Accueil</NavLink></li>
            <li><NavLink exact to="/reservation">Réservation</NavLink></li>
            <li><NavLink exact to="/activities">Activités</NavLink></li>
            <li><NavLink exact to="/events">Evènements</NavLink></li>
            <li><NavLink exact to="/users">Adhérents</NavLink></li>
            <li>
              <button
                type="button"
                className="waves-effect waves-light btn-small teal darken-1 white-text col s2 right"
                onClick={handleDisconnect}
              >
                Se déconnecter
              </button>
            </li>
          </ul>
        </div>
      </nav>
      <ul className={sidebarDisplay} id="mobile-demo">
        <li><NavLink onClick={handleClick} exact to="/">Accueil</NavLink></li>
        <li><NavLink onClick={handleClick} exact to="/reservation">Réservation</NavLink></li>
        <li><NavLink onClick={handleClick} exact to="/activities">Activités</NavLink></li>
        <li><NavLink onClick={handleClick} exact to="/events">Evènements</NavLink></li>
        <li><NavLink onClick={handleClick} exact to="/users">Adhérents</NavLink></li>
        <li>
          <button
            type="button"
            className="waves-effect waves-light btn-small teal darken-1 white-text col s2 right"
            onClick={handleDisconnect}
          >
            Se déconnecter
          </button>
        </li>
      </ul>
    </div>
  );
}

Menu.propTypes = {
  dispatch: PropTypes.func,
};

Menu.defaultProps = {
  dispatch: connect.dispatch,
};

export default connect()(Menu);
