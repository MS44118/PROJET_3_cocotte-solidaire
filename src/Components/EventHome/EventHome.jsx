import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
// import Calendar from 'react-calendar';
import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css/dist/js/materialize';


import './EventHome.css';

import ReservationHome from '../ReservationHome/ReservationHome';


function EventHome() {
  // to store api response
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  // to collapse all the registrations for a specific event
  const [collapses, setCollapses] = useState([]);

  // { filtre_xxxxx: true, check_xxxxx: true }
  const [filterCuisiner, setFilterCuisiner] = useState(true);
  const [filterManger, setFilterManger] = useState(true);
  const [filterAutres, setFilterAutres] = useState(true);

  const checkAll = () => {
    if (!filterCuisiner || !filterManger || !filterAutres) {
      setFilterCuisiner(true);
      setFilterManger(true);
      setFilterAutres(true);
    } else {
      setFilterCuisiner(false);
      setFilterManger(false);
      setFilterAutres(false);
    }
  };

  // Auto Init allows you to initialize all of the Materialize Components
  useEffect(() => {
    M.AutoInit();
  }, []);

  // api call
  useEffect(() => {
    axios.get('http://localhost:8000/api/future-events')
      .then((result) => {
        setEvents(result.data);
        setFilteredEvents(result.data);
      });
  }, []);

  // set filters according to checkboxes
  useEffect(() => {
    if (events.length > 0) {
      setFilteredEvents(events.filter((event) => {
        if (filterManger) {
          if (event.name_event === 'manger') {
            return event;
          }
        }
        if (filterCuisiner) {
          if (event.name_event === 'cuisiner & manger') {
            return event;
          }
        }
        if (filterAutres) {
          if (event.name_event !== 'manger' && event.name_event !== 'cuisiner & manger') {
            return event;
          }
        }
        return false;
      }));
    }
  }, [events, filterManger, filterCuisiner, filterAutres]);

  // set for a specific event, if the list of registrations is visible or not
  useEffect(() => {
    let array = [];
    array = events.map(() => (false));
    setCollapses(array);
  }, [events, filteredEvents]);

  return (
    <div className="container">

      {/* <div className="row reste-a-faire">
        <ul>
          <li>RESTE A FAIRE: </li>
          <li>lien vers modifier évènement</li>
          <li>lien vers modifier reservation</li>
          <li>actions supprimer évenement</li>
          <li>actions supprimer reservation</li>
          <li>hoover allergies</li>
          <li>hoover commentaires</li>
          <li>lier les actions de filtrages au calendrier</li>
        </ul>
      </div> */}

      <div className="row title">
        <h1>Evènements à venir</h1>
      </div>

      <div className="row calendar">
        {/* <Calendar /> */}
      </div>

      <div className="row checkbox">
        <label htmlFor="filterAll">
          <input
            type="checkbox"
            id="filterAll"
            checked={filterCuisiner === true && filterManger === true && filterAutres === true ? 'checked' : ''}
            onChange={() => checkAll()}
          />
          <span>Tous</span>
        </label>

        <label htmlFor="filterCuisiner">
          <input
            type="checkbox"
            id="filterCuisiner"
            checked={filterCuisiner ? 'checked' : ''}
            onChange={e => setFilterCuisiner(e.target.checked)}
          />
          <span>Cuisiner et Manger</span>
        </label>

        <label htmlFor="filterManger">
          <input
            type="checkbox"
            id="filterManger"
            checked={filterManger ? 'checked' : ''}
            onChange={e => setFilterManger(e.target.checked)}

          />
          <span>Manger</span>
        </label>

        <label htmlFor="filterAutres">
          <input
            type="checkbox"
            id="filterAutres"
            checked={filterAutres ? 'checked' : ''}
            onChange={e => setFilterAutres(e.target.checked)}
          />
          <span>Autres</span>
        </label>
      </div>

      <div className="row list-events">

        {/* entetes liste des évenements */}
        <ul className="event-header">
          <li className="col s1">Evènement</li>
          <li className="col s1">Date</li>
          <li className="col s1">Heure</li>
          <li className="col s1">adultes</li>
          <li className="col s1">enfants</li>
          <li className="col s1">capacité</li>
          <li className="col s1">modifier</li>
          <li className="col s1">supprimer</li>
          <li className="col s1">email</li>
          <li className="col s1">allergies</li>
          <li className="col s1">commentaires</li>
          <li className="col s1"> </li>
        </ul>

        {/* liste des evenements */}
        {filteredEvents.map((event, index) => (
          <div className="event" key={event.id_event} data-genre={event.name_event}>
            <ul className="event-item row valign-wrapper center-align">
              <li className="col s1">{event.name_event}</li>
              <li className="col s1">{moment(event.date_b).format('dd.Do MMM YY')}</li>
              <li className="col s1">{moment(event.date_b).format('HH:mm')}</li>
              <li className="col s1">{event.nb_adults}</li>
              <li className="col s1">{event.nb_children}</li>
              <li className="col s1">
                {event.nb_persons}
                /
                {event.capacity}
              </li>
              <li className="col s1">
                <i className="material-icons icon-green">create</i>
              </li>
              <li className="col s1"><i className="material-icons icon-green">delete_forever</i></li>
              <li className="col s1">
                {event.nb_emails < event.NB_REG
                  ? <i className="material-icons warning-icon">priority_high</i>
                  : null
                }
              </li>
              <li className="col s1">
                {event.nb_allergies > 0
                  ? <i className="material-icons warning-icon">warning</i>
                  : null
                }
              </li>
              <li className="col s1">
                {event.nb_comments > 0
                  ? <i className="material-icons icon-green">comment</i>
                  : null
                }
              </li>
              <li className="col s1">
                <button
                  className="btn-floating waves-effect waves-light valign-wrapper"
                  onClick={() => setCollapses(
                    [
                      ...collapses.slice(0, [index]),
                      !collapses[index],
                      ...collapses.slice([index + 1], collapses.length),
                    ],
                  )}
                  type="submit"
                  name="action"
                >
                  {collapses[index] === false
                    ? <i className="material-icons">expand_more</i>
                    : <i className="material-icons">expand_less</i>
                  }
                </button>
              </li>
            </ul>

            {/* s'affiche si collapse activé */}
            <ul>
              {collapses[index] === false
                ? null
                : (
                  <ReservationHome eventId={event.id_event} />
                )
              }
            </ul>

            {/* affiche lien pour nouvelle résa si collapse activé et si évènement pas complet */}
            <ul>
              {collapses[index] === true && event.nb_persons < event.capacity
                ? (
                  <li className="create-registration col s12">
                    <Link to="/reservation" eventId={event.id_event}>
                      il reste de la place: créer une nouvelle réservation
                    </Link>
                  </li>
                )
                : null
              }
            </ul>

          </div>
        ))}

      </div>
    </div>
  );
}

export default EventHome;
