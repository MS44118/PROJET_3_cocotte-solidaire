import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactTooltip from 'react-tooltip';

import './ReservationHome.css';

function ReservationHome(props) {
  const [registrations, setRegistrations] = useState([]);

  // ESLINT WARNING: to prevent definitions of unused prop types
  const [eventProps, setEventProps] = useState({});
  useEffect(() => setEventProps(props), [props]);

  // get the registrations details from database
  useEffect(() => {
    axios.get('http://localhost:8000/api/future-registrations')
      .then((result) => {
        setRegistrations(result.data);
      });
  }, []);


  return (
    <div className="row list-registrations">

      {/* entetes liste des réservations */}
      <ul className="registration-header">
        <li className="col s1">n°adhérent</li>
        <li className="col s1">prénom</li>
        <li className="col s1">nom</li>
        <li className="col col-icon s1">adultes</li>
        <li className="col col-icon s1">enfants</li>
        <li className="col s1">téléphone</li>
        <li className="col col-icon s1">email</li>
        <li className="col col-icon s1">allergies</li>
        <li className="col col-icon s1">commentaires</li>
        <li className="col col-icon s1"><i className="material-icons icon-green">create</i></li>
        <li className="col col-icon s1"><i className="material-icons icon-green">delete_forever</i></li>
        <li className="col col-icon s1"> </li>
      </ul>

      {/* liste des réservations */}
      {registrations
        .filter(registration => registration.event_id === eventProps.eventId)
        .map(registration => (
          <ul key={registration.id_registration} className="registration-item">
            <li className="col s1">{registration.member_id}</li>
            <li className="col s1">{registration.firstname}</li>
            <li className="col s1">{registration.lastname}</li>
            <li className="col col-icon s1">
              {registration.quantity_adult}
            </li>
            <li className="col col-icon s1">
              {registration.quantity_children}
            </li>
            <li className="col s1">{registration.phone}</li>
            <li className="col col-icon s1">
              { registration.email === ' ' || '' || !registration.email
                ? (
                  <p data-tip data-for={`email-registration-${registration.id_registration}`}>
                    <i className="material-icons warning-icon">priority_high</i>
                    <ReactTooltip id={`email-registration-${registration.id_registration}`} type="error">
                      <span>{registration.email}</span>
                    </ReactTooltip>
                  </p>
                )
                : null
              }
            </li>
            <li className="col col-icon s1">
              { registration.allergie === ' ' || '' || !registration.allergie
                ? null
                : (
                  <p data-tip data-for={`allergies-registration-${registration.id_registration}`}>
                    <i className="material-icons warning-icon">warning</i>
                    <ReactTooltip id={`allergies-registration-${registration.id_registration}`} type="error">
                      <span>{registration.allergie}</span>
                    </ReactTooltip>
                  </p>
                )
              }
            </li>
            <li className="col col-icon s1">
              { registration.comment === ' ' || '' || !registration.comment
                ? null
                : (
                  <p data-tip data-for={`comments-registration-${registration.id_registration}`}>
                    <i className="material-icons icon-green">comment</i>
                    <ReactTooltip id={`comments-registration-${registration.id_registration}`} type="error">
                      <span>{registration.comment}</span>
                    </ReactTooltip>
                  </p>
                )
              }
            </li>
            <li className="col col-icon s1"><i className="material-icons icon-green">create</i></li>
            <li className="col col-icon s1"><i className="material-icons icon-green">delete_forever</i></li>
            <li className="col col-icon s1"> </li>
          </ul>
        ))
      }

    </div>
  );
}

export default ReservationHome;
