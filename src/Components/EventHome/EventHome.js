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
    console.log('Auto Init allows you to initialize all of the Materialize Components');
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
      <p className="RAF"> RESTE A FAIRE: lier les actions de filtrages au calendrier </p>
      <Calendar />

      <form action="#">
        <p className="RAF"> RESTE A FAIRE: lier les actions de filtrages aux checkbox </p>
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
      {/* entetes liste des évenements */}
      <ul className="events with-header">
        <li className="event-header row">
          <p className="col s1">Atelier</p>
          <p className="col s2">Date</p>
          <p className="col s1">Heure</p>
          <p className="col s1">adultes</p>
          <p className="col s1">enfants</p>
          <p className="col s1">capacité</p>
          <p className="col s1">modifier</p>
          <p className="col s1">supprimer</p>
          <p className="col s1">alertes</p>
          <p className="col s1">alertes</p>
          <p className="col s1">détails</p>
        </li>
      </ul>

      {/* liste des evenements */}
      {events.map((event, index) => {
        return (
          <ul key={events[index]}>
            <li className="event-item row valign-wrapper center-align">
              <p className="col s1">{event.name}</p>
              <p className="col s2">{moment(event.date_b).format('dddd Do MMM YYYY')}</p>
              <p className="col s1">{moment(event.date_b).format('HH:mm')}</p>
              <p className="col s1">{event.quantity_adult}</p>
              <p className="col s1">{event.quantity_children}</p>
              <p className="col s1">
                {event.quantity_adult + event.quantity_children / 2}
                /
                {event.capacity}
              </p>
              <p className="col s1"><i className="material-icons icon-green">create</i></p>
              <p className="col s1"><i className="material-icons icon-green">delete_forever</i></p>
              <p className="col s1"><i className="material-icons icon-green">warning</i></p>
              <p className="col s1"><i className="material-icons icon-green">priority_high</i></p>
              <p className="col s1">
                <button className="btn-floating waves-effect waves-light valign-wrapper" onClick={() => handleShowRegistrations(event)} type="submit" name="action">
                  { showRegistrations === false
                    ? <i className="material-icons">expand_more</i>
                    : <i className="material-icons">expand_less</i>
                  }
                </button>
              </p>
            </li>
            { showRegistrations === false
              ? null
              : (
                <ul className="registrations with-header">
                  <li className="registration-header row">
                    <p className="col s1">prénom</p>
                    <p className="col s1">nom</p>
                    <p className="col s2">email</p>
                    <p className="col s1">téléphone</p>
                    <p className="col s1">n°adhérent</p>
                    <p className="col s1">nb adulte(s)</p>
                    <p className="col s1">nb enfant(s)</p>
                    <p className="col s1"><i className="material-icons icon-green">create</i></p>
                    <p className="col s1"><i className="material-icons icon-green">delete_forever</i></p>
                    <p className="col s1"><i className="material-icons icon-green">warning</i></p>
                    <p className="col s1"><i className="material-icons icon-green">priority_high</i></p>
                  </li>
                  <ReservationHome />
                </ul>
              )
            }
          </ul>
        );
      })}
      <hr />
      <p> wilders x la cocotte solidaire</p>
    </div>
  );
}

export default EventHome;
