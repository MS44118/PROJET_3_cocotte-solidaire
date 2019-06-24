import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import toaster from 'toasted-notes';
import 'toasted-notes/src/styles.css';

import { tokenApprovedTrueAction } from '../../Actions/tokenAction';

function Login({ dispatch }) {
  const [emailSignIn, setEmailSignIn] = useState('');
  const [passwordSignIn, setPasswordSignIn] = useState('');
  const [adminSignIn, setAdminSignIn] = useState({});

  useEffect(() => {
    const adminTemp = {
      emailSignIn,
      passwordSignIn,
    };
    setAdminSignIn(adminTemp);
  }, [emailSignIn, passwordSignIn]);

  const handleSendSignIn = () => {
    axios.post('http://localhost:8000/login', adminSignIn)
      .then((data) => {
        const token = data.data;
        localStorage.setItem('id_token', token);
        dispatch(tokenApprovedTrueAction());
        toaster.notify("Bienvenue sur l'espace admin ! ", {
          duration: 3000,
        });
      })
      .catch(() => {
        toaster.notify('Erreur dans le mail ou le mot de passe.', {
          duration: 3000,
        });
      });
  };

  return (
    <div className="valign-wrapper" style={{ width: '100vw', height: '100vh' }}>
      <div style={{ width: '100vh', margin: 'auto' }} className="center-align">
        <h1>La cocotte solidaire</h1>
        <h2>Espace adminstrateur</h2>
        <div className="row">
          <div className="input-field col s6">
            <input
              id="emailSignIn"
              type="email"
              value={emailSignIn}
              onChange={event => setEmailSignIn(event.target.value)}
              required
              className="validate"
            />
            <label htmlFor="emailSignIn">Email</label>
          </div>
          <div className="input-field col s6">
            <input
              id="passwordSignIn"
              type="password"
              value={passwordSignIn}
              onChange={event => setPasswordSignIn(event.target.value)}
              required
              className="validate"
            />
            <label htmlFor="passwordSignIn">Mot de passe</label>
          </div>
        </div>
        <div className="input-field row">
          <button
            type="button"
            className="waves-effect waves-light btn-small teal darken-1 white-text col s2 offset-s3"
            onClick={handleSendSignIn}
          >
            Se connecter
          </button>
        </div>
      </div>
    </div>
  );
}

Login.propTypes = {
  dispatch: PropTypes.func,
};

Login.defaultProps = {
  dispatch: null,
};

export default connect()(Login);
