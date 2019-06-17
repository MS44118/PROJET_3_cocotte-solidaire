import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import Calendar from 'react-calendar';
import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css/dist/js/materialize';


import './EventHome.css';

import ReservationHome from '../ReservationHome/ReservationHome';


function EventHome() {
  // to store api response
  const [events, setEvents] = useState([]);
  // to collapse all the registrations for a specific event
  const [collapseRegistrations, setCollapseRegistrations] = useState([]);

  // { filtre_manger: true, check_manger: true }
  const [filterCuisiner, setFilterCuisiner] = useState(false);
  const [filterManger, setFilterManger] = useState(false);
  const [filterAutres, setFilterAutres] = useState(false);
  const [filterAll, setFilterAll] = useState(false);

  // Auto Init allows you to initialize all of the Materialize Components
  useEffect(() => {
    M.AutoInit();
  }, []);

  // api call
  useEffect(() => {
    axios.get('http://localhost:8000/api/future-events')
      .then((result) => {
        setEvents(result.data);
      });
  }, []);

  // set for a specific event, if the list of registrations is visible or not
  useEffect(() => {
    let array = [];
    array = events.map(() => (false));
    setCollapseRegistrations(array);
  }, [events]);

  const checkAll = () => {
    let check = document.getElementsByTagName('input');
    for (let i = 0; i < check.length; i += 1) {
      if (check[i].type === 'checkbox') {
        check[i].checked = true;
      }
    }
  };


  return (
    <div>
      <p className="RAF"> RESTE A FAIRE: lier les actions de filtrages au calendrier </p>
      <Calendar />

      <p className="RAF"> RESTE A FAIRE: lier les actions de filtrages aux checkbox </p>
      <p>filtrer par activités</p>
      {/* <form action="#"> */}
      <div className="container">

        <div className="row">
          <div className="input-field col s6">
            <label>
              <input
                type="checkbox"
                // name="filterCuisiner"
                checked={filterAll ? 'checked' : ''}
                onChange={event => setFilterAll(event.target.checked)}
              />
              <span>Tous</span>
            </label>
          </div>
        </div>

        <div className="row">
          <div className="input-field col s6">
            <label>
              <input
                type="checkbox"
                // name="filterCuisiner"
                checked={filterCuisiner ? 'checked' : ''}
                onChange={event => setFilterCuisiner(event.target.checked)}
              />
              <span>Cuisiner et Manger</span>
            </label>
          </div>
        </div>

        <div className="row">
          <div className="input-field col s6">
            <label>
              <input
                type="checkbox"
                // name="filterManger"
                checked={filterManger ? 'checked' : ''}
                onChange={event => setFilterManger(event.target.checked)}
              />
              <span>Manger</span>
            </label>
          </div>
        </div>

        <div className="row">
          <div className="input-field col s6">
            <label>
              <input
                type="checkbox"
                // name="filterAutres"
                checked={filterAutres ? 'checked' : ''}
                onChange={event => setFilterAutres(event.target.checked)}
              />
              <span>Autres</span>
            </label>
          </div>
        </div>

      </div>

      {/* </form> */}




      <div className="events-registrations-list container">
        <h3>Liste des evenements</h3>
        <ul className="RAF">
          <p> RESTE A FAIRE: </p>
          <li> actions supprimer/modifier évènement</li>
          <li> actions supprimer/modifier reservation</li>
        </ul>


        {/* entetes liste des évenements */}
        <ul className="events with-header">
          <li className="event-header row">
            <p className="col s1">Evènement</p>
            <p className="col s1">Date</p>
            <p className="col s1">Heure</p>
            <p className="col s1">adultes</p>
            <p className="col s1">enfants</p>
            <p className="col s1">capacité</p>
            <p className="col s1">modifier</p>
            <p className="col s1">supprimer</p>
            <p className="col s1">email</p>
            <p className="col s1">allergies</p>
            <p className="col s1">commentaires</p>
            <p className="col s1"> </p>
          </li>
        </ul>

        {/* liste des evenements */}
        {events
          .filter(event => event.name_event === 'manger')
          .filter(event => event.name_event === 'manger' || 'cuisiner' )
          .filter(event => event.name_event === 'manger')
          .map((event, index) => (
            <ul className="event-ul" key={events[index]} data-genre={event.name_event}>
              <li className="event-item row valign-wrapper center-align">
                <p className="col s1">{event.name_event}</p>
                <p className="col s1">{moment(event.date_b).format('dd.Do MMM YY')}</p>
                <p className="col s1">{moment(event.date_b).format('HH:mm')}</p>
                <p className="col s1">{event.nb_adults}</p>
                <p className="col s1">{event.nb_children}</p>
                <p className="col s1">
                  {event.nb_persons}
                  /
                  {event.capacity}
                </p>
                <p className="col s1">
                  <i className="material-icons icon-green">create</i>
                </p>
                <p className="col s1"><i className="material-icons icon-green">delete_forever</i></p>
                <p className="col s1">
                  { event.nb_emails < event.NB_REG
                    ? <i className="material-icons email-missing">priority_high</i>
                    : <i className="material-icons icon-green">priority_high</i>
                  }
                </p>
                <p className="col s1">
                  { event.nb_allergies > 0
                    ? <i className="material-icons allergie-warning">warning</i>
                    : <i className="material-icons icon-green">warning</i>
                  }
                </p>
                <p className="col s1">
                  { event.nb_comments > 0
                    ? <i className="material-icons icon-green">comment</i>
                    : null
                  }
                </p>
                <p className="col s1">
                  <button
                    className="btn-floating waves-effect waves-light valign-wrapper"
                    onClick={() => setCollapseRegistrations(
                      [
                        ...collapseRegistrations.slice(0, [index]),
                        !collapseRegistrations[index],
                        ...collapseRegistrations.slice([index + 1], collapseRegistrations.length),
                      ],
                    )}
                    type="submit"
                    name="action"
                  >
                    { collapseRegistrations[index] === false
                      ? <i className="material-icons">expand_more</i>
                      : <i className="material-icons">expand_less</i>
                    }
                  </button>
                </p>
              </li>
              { collapseRegistrations[index] === false
                ? null
                : (
                  <div>
                    <ReservationHome eventId={event.id_event} />
                    { event.nb_persons < event.capacity
                      ? <p>il reste de la place: créer une nouvelle réservation</p>
                      : null
                    }
                  </div>
                )
              }
            </ul>
          ))
        }
      </div>
    </div>
  );
}

export default EventHome;
