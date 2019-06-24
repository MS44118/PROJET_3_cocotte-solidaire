import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
        <li className="col s1">prénom</li>
        <li className="col s1">nom</li>
        <li className="col s1">email</li>
        <li className="col s1">téléphone</li>
        <li className="col s1">n°adhérent</li>
        <li className="col s1">adulte(s)</li>
        <li className="col s1">enfant(s)</li>
        {/* <li className="col s1"><i className="material-icons icon-green">create</i></li>
        <li className="col s1"><i className="material-icons icon-green">delete_forever</i></li>
        <li className="col s1"><i className="material-icons icon-green">warning</i></li>
        <li className="col s1"><i className="material-icons icon-green">priority_high</i></li>
        <li className="col s1"><i className="material-icons icon-green">comment</i></li> */}
        <li className="col s1">modifier</li>
        <li className="col s1">supprimer</li>
        <li className="col s1">email</li>
        <li className="col s1">allergies</li>
        <li className="col s1">commentaires</li>
      </ul>

      {/* liste des réservations */}
      {registrations
        .filter(registration => registration.event_id === eventProps.eventId)
        .map(registration => (
          <ul key={registration.id_registration} className="registration-item">
            <li className="col s1">{registration.firstname}</li>
            <li className="col s1">{registration.lastname}</li>
            <li className="col s1">{registration.email}</li>
            <li className="col s1">{registration.phone}</li>
            <li className="col s1">{registration.member_id}</li>
            <li className="col s1">
              {registration.quantity_adult}
              {/* {' adul.'} */}
            </li>
            <li className="col s1">
              {registration.quantity_children}
              {/* {' enf.'} */}
            </li>
            <li className="col s1"><i className="material-icons icon-green">create</i></li>
            <li className="col s1"><i className="material-icons icon-green">delete_forever</i></li>
            <li className="col s1">
              { registration.email === ''
                ? <i className="material-icons warning-icon">priority_high</i>
                : null
              }
            </li>
            <li className="col s1">
              { registration.allergie === ' '
                ? null
                : <i className="material-icons warning-icon">warning</i>
              }
            </li>
            <li className="col s1">
              { registration.comment === ' '
                ? null
                : <i className="material-icons icon-green">comment</i>
              }
            </li>
          </ul>
        ))
      }

    </div>
  );
}

export default ReservationHome;
