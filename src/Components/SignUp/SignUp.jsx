import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toaster from 'toasted-notes';
import 'toasted-notes/src/styles.css';

function SignUp() {
  const [emailSignUp, setEmailSignUp] = useState('');
  const [passwordSignUp, setPasswordSignUp] = useState('');
  const [nameSignUp, setNameSignUp] = useState('');
  const [adminSignUp, setAdminSignUp] = useState({});

  useEffect(() => {
    const adminTemp = {
      nameSignUp,
      emailSignUp,
      passwordSignUp,
    };
    setAdminSignUp(adminTemp);
  }, [emailSignUp, passwordSignUp, nameSignUp]);

  const handleSendSignUp = () => {
    axios.post('http://localhost:8000/login/SignUp', adminSignUp)
      .then(() => {
        toaster.notify('Enregistré avec succès.', {
          duration: 2000,
        });
      })
      .catch(() => {
        toaster.notify("Problème lors de l'enregistrement.", {
          duration: 2000,
        });
      });
  };

  return (
    <div className="valign-wrapper" style={{ width: '100vw', height: '80vh' }}>
      <div style={{ width: '100vh', margin: 'auto' }} className="center-align">
        <h1>Sign up</h1>
        <div className="row">
          <div className="input-field col s4">
            <input
              id="nameSignUp"
              type="text"
              value={nameSignUp}
              onChange={event => setNameSignUp(event.target.value)}
              required
              className="validate"
            />
            <label htmlFor="nameSignUp">Nom</label>
          </div>
          <div className="input-field col s4">
            <input
              id="emailSignUp"
              type="email"
              value={emailSignUp}
              onChange={event => setEmailSignUp(event.target.value)}
              required
              className="validate"
            />
            <label htmlFor="emailSignUp">Email</label>
          </div>
          <div className="input-field col s4">
            <input
              id="passwordSignUp"
              type="password"
              value={passwordSignUp}
              onChange={event => setPasswordSignUp(event.target.value)}
              required
              className="validate"
            />
            <label htmlFor="passwordSignUp">mot de passe</label>
          </div>
        </div>
        <div className="input-field row">
          <button
            type="button"
            className="waves-effect waves-light btn-small teal darken-1 white-text col s2 offset-s3"
            onClick={handleSendSignUp}
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
