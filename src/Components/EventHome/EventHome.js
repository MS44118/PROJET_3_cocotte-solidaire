import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import Calendar from 'react-calendar';
import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css/dist/js/materialize';


import './EventHome.css';

import ReservationHome from '../ReservationHome/ReservationHome';


function EventHome() {
  const [events, setEvents] = useState([]);
  const [showRegistrations, setShowRegistrations] = useState(false);

  useEffect(() => {
    M.AutoInit();
    console.log('toto');
  }, []);

  // api call
  useEffect(() => {
    axios.get('http://localhost:8000/')
      .then((result) => {
        setEvents(result.data);
      });
  }, []);

  // display registrations : ALL
  const handleShowRegistrations = () => {
    setShowRegistrations(!showRegistrations);
  };

  return (
    <div>
      <Calendar />

      <form action="#">
        <p>
          <label htmlFor="checkManger">
            <input type="checkbox" className="filled-in" checked="checked" />
            <span>Manger</span>
          </label>
          <label htmlFor="checkCuisiner">
            <input type="checkbox" className="filled-in" checked="checked" />
            <span>Cuisiner & Manger</span>
          </label>
          <label htmlFor="checkAteliers">
            <input type="checkbox" className="filled-in" checked="checked" />
            <span>Ateliers</span>
          </label>
        </p>
      </form>

      <h3>Liste des evenements</h3>
      <table>
        {/* entetes liste des évenements */}
        <thead>
          <tr>
            <th>Atelier</th>
            <th>Date</th>
            <th>Heure</th>
            <th>adultes</th>
            <th>enfants</th>
            <th>capacité</th>
            <th>modifier</th>
            <th>supprimer</th>
            <th>alertes</th>
            <th>alertes</th>
            {/* column of the icon collapse for each event in the <tbody> map */}
            <th> </th>
          </tr>
        </thead>

        {/* liste des evenements */}
        {events.map((event, index) => {
          return (
            <tbody key={events[index]}>
              <tr className="event-display">
                <td>{event.name}</td>
                <td>{moment(event.date_b).format('dddd Do MMM YYYY')}</td>
                <td>{moment(event.date_b).format('HH:mm')}</td>
                <td>{event.quantity_adult}</td>
                <td>{event.quantity_children}</td>
                <td>{event.capacity}</td>
                <td><i className="material-icons icon-green">create</i></td>
                <td><i className="material-icons icon-green">delete_forever</i></td>
                <td><i className="material-icons icon-green">warning</i></td>
                <td><i className="material-icons icon-green">priority_high</i></td>
                {/* <td><i className="material-icons icon-green">expand_more</i></td> */}
                <td onClick={() => handleShowRegistrations(event)}><i className="material-icons icon-green">expand_more</i></td>
              </tr>
              { showRegistrations === false
                ? null
                : (
                  <tr className="registration-display">
                    <td colSpan="11">
                      <ReservationHome />
                    </td>
                  </tr>
                )
              }
            </tbody>
          );
        })}

      </table>
      <p> </p>
    </div>
  );
}

export default EventHome;
