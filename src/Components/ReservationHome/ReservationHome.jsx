import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ReservationHome.css';

function ReservationHome(props) {
  const [eventIdProps, setEventIdProps] = useState({});
  const [registrations, setRegistrations] = useState([]);

  // ESLINT WARNING: to prevent definitions of unused prop types
  useEffect(() => setEventIdProps(props));

  // get the registrations details from database
  useEffect(() => {
    axios.get('http://localhost:8000/api/future-registrations')
      .then((result) => {
        setRegistrations(result.data);
      });
  }, []);


  return (
    <div>
      <ul className="registrations with-header">
        <li className="registration-header row">
          <p className="col s1">prénom</p>
          <p className="col s1">nom</p>
          <p className="col s1">email</p>
          <p className="col s1">téléphone</p>
          <p className="col s1">n°adhérent</p>
          <p className="col s1">nb adulte(s)</p>
          <p className="col s1">nb enfant(s)</p>
          <p className="col s1"><i className="material-icons icon-green">create</i></p>
          <p className="col s1"><i className="material-icons icon-green">delete_forever</i></p>
          <p className="col s1"><i className="material-icons icon-green">warning</i></p>
          <p className="col s1"><i className="material-icons icon-green">priority_high</i></p>
          <p className="col s1"><i className="material-icons icon-green">comment</i></p>
        </li>
        {registrations
          .filter(registration => registration.event_id === eventIdProps.eventId)
          .map((registration, index) => (
            <li key={registrations[index]} className="registration-item row center-align">
              <p className="col s1">{registration.firstname}</p>
              <p className="col s1">{registration.lastname}</p>
              <p className="col s1">{registration.email}</p>
              <p className="col s1">{registration.phone}</p>
              <p className="col s1">{registration.member_id}</p>
              <p className="col s1">
                {registration.quantity_adult}
                {' adulte(s)'}
              </p>
              <p className="col s1">
                {registration.quantity_children}
                {' enfant(s)'}
              </p>
              <p className="col s1"><i className="material-icons icon-green">create</i></p>
              <p className="col s1"><i className="material-icons icon-green">delete_forever</i></p>
              <p className="col s1">
                { registration.email === ''
                  ? <i className="material-icons email-missing">priority_high</i>
                  : null
                }
              </p>
              <p className="col s1">
                { registration.allergie === ' '
                  ? null
                  : <i className="material-icons allergie-warning">warning</i>
                }
              </p>
              <p className="col s1">
                { registration.comment === ' '
                  ? null
                  : <i className="material-icons icon-green">comment</i>
                }
              </p>
            </li>
          ))
        }
      </ul>
    </div>
  );
}

export default ReservationHome;
