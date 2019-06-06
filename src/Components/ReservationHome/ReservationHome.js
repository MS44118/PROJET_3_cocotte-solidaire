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
      <table>
        {/* liste des inscritions */}
        {registrations.map((registration, index) => {
          return (
            <tbody key={registrations[index]}>
              <tr>
                <td>{registration.firstname}</td>
                <td>{registration.lastname}</td>
                <td>{registration.email}</td>
                <td>{registration.phone}</td>
                <td>{registration.member_id}</td>
                <td>{registration.quantity_adult} adulte(s)</td>
                <td>{registration.quantity_children} enfant(s)</td>
                <td><i className="material-icons icon-green">create</i></td>
                <td><i className="material-icons icon-green">delete_forever</i></td>
                <td><i className="material-icons icon-green">warning</i></td>
                <td><i className="material-icons icon-green">priority_high</i></td>
                {/* <td><i className="material-icons icon-green">expand_more</i></td> */}
              </tr>
            </tbody>
          );
        })}
      </table>
  );
}


export default ReservationHome;
