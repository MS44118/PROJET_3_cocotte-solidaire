import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import moment from 'moment';

function ReservationHome() {
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/')
      .then((result) => {
        setRegistrations(result.data);
      });
  }, []);

  return (
    <div>
      {registrations.map((registration, index) => (
        <li key={registrations[index]} className="registration-item row center-align">
          <p className="col s1">{registration.firstname}</p>
          <p className="col s1">{registration.lastname}</p>
          <p className="col s2">{registration.email}</p>
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
          <p className="col s1"><i className="material-icons icon-green">warning</i></p>
          <p className="col s1"><i className="material-icons icon-green">priority_high</i></p>
        </li>
      ))}
    </div>
  );
}


export default ReservationHome;
