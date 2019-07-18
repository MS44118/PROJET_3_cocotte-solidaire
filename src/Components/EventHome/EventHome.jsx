import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import moment from 'moment';
import { Modal, message, Tooltip } from 'antd';
import conf from '../../app.conf';
import setHeaderToken from '../../Utils/tokenUtil';

// CSS
import './EventHome.css';
import 'antd/dist/antd.css';

// COMPONENTS
import ReservationHome from '../ReservationHome/ReservationHome';
import CalendarHome from '../CalendarHome/CalendarHome';

// ACTIONS REDUX
import { initEventsAction, initRegistrationsAction, removeEventAction } from '../../Actions/homeAction';

function EventHome({ events, registrations, dispatch }) {
  // to collapse all the registrations for a specific event
  const [collapses, setCollapses] = useState([]);
  // to show modale asking confirmation to delete event
  const [deleteModal, setDeleteModal] = useState([]);
  // events filtered with checkboxes
  const [filteredEvents, setFilteredEvents] = useState([]);
  // checkboxes filters
  const [filterCuisiner, setFilterCuisiner] = useState(true);
  const [filterManger, setFilterManger] = useState(true);
  const [filterAutres, setFilterAutres] = useState(true);

  // { filtre_xxxxx: true/visible or false/hidden, check_xxxxx: true/visible or false/hidden}
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

  // api call to get events and registrations and send in redux store + filteredEvents
  useEffect(() => {
    setHeaderToken(() => {
      axios.get(`${conf.url}/api/future-events`)
        .then((result) => {
          setFilteredEvents(result.data);
          dispatch(initEventsAction(result.data));
        });
      axios.get(`${conf.url}/api/future-registrations`)
        .then((result) => {
          dispatch(initRegistrationsAction(result.data));
        });
    });
  }, []);

  // to set filters according to checkboxes
  // 1 = manger
  // 2 = cuisiner et manger (also called "cuisiner" in home admin checkboxes)
  // 3 = autres (default parameter for events created without activity selected)
  // >3 = activities created other than "manger" or "cuisiner et manger" (ie: "poterie" or "yoga")
  useEffect(() => {
    if (events.length > 0) {
      setFilteredEvents(events.filter((event) => {
        if (filterManger) {
          if (event.id_activity === 1) {
            return event;
          }
        }
        if (filterCuisiner) {
          if (event.id_activity === 2) {
            return event;
          }
        }
        if (filterAutres) {
          if (event.id_activity >= 3) {
            return event;
          }
        }
        return false;
      }));
    }
  }, [events, filterManger, filterCuisiner, filterAutres]);

  // for each event, set the visibility of registrations details + Modals to delete a registration
  useEffect(() => {
    let array = [];
    array = events.map(() => (false));
    setCollapses(array);
    setDeleteModal(array);
  }, [events, filteredEvents]);

  // to filter events when a date selected on calendar
  const selectedDate = (date) => {
    const arrayTemp = events.filter(event => moment(event.date_b).format('LL') === date);
    if (arrayTemp.length > 0) {
      setFilteredEvents(arrayTemp);
    } else {
      setFilteredEvents(events);
    }
  };

  // Request to delete an event
  const deleteEvent = (id) => {
    setHeaderToken(() => {
      axios
        .delete(`${conf.url}/api/event/${id}`)
        .then((res) => {
          if (res.status === 200) {
            message.success(res.data, 3);
            dispatch(removeEventAction(id));
            const index = filteredEvents.findIndex(i => i.id_event === id);
            setFilteredEvents(
              [
                ...filteredEvents.slice(0, [index]),
                ...filteredEvents.slice([index + 1], filteredEvents.length),
              ],
            );
          } else {
            message.warning(res.data, 3);
          }
        })
        .catch((err) => {
          message.error(err.response.data, 3);
        });
    });
  };

  // Modal to delete an event
  const { confirm } = Modal;
  const showDeleteConfirm = (index) => {
    confirm({
      title:
        `Vous aller supprimer l'évènement n° ${events[index].id_event}:
        ${events[index].name_event === '' ? events[index].name_activity : events[index].name_event}
        du ${moment(events[index].date_b).format('dddd Do/MM/YY')}
        ${moment(events[index].date_b).format('HH:mm-')}${moment(events[index].date_e).format('HH:mm')}
        (${events[index].NB_REG} réservations)`,
      okType: 'danger',
      okText: 'Supprimer',
      cancelText: 'Annuler',
      onOk() {
        setDeleteModal([
          ...deleteModal.slice(0, [index]),
          !deleteModal[index],
          ...deleteModal.slice([index + 1], deleteModal.length),
        ]);
        deleteEvent(events[index].id_event);
      },
      onCancel() {
        setDeleteModal([
          ...deleteModal.slice(0, [index]),
          !deleteModal[index],
          ...deleteModal.slice([index + 1], deleteModal.length),
        ]);
      },
    });
  };

  return (
    <div className="container">
      <div className="row title">
        <h1>Evènements à venir</h1>
      </div>

      <div className="row calendar">
        <CalendarHome
          selectedDate={selectedDate}
          filterCuisiner={filterCuisiner}
          filterManger={filterManger}
          filterAutres={filterAutres}
        />
      </div>

      <div className="row checkbox">
        <label className="col hide-on-small-only" htmlFor="filterAll">
          <input
            type="checkbox"
            id="filterAll"
            checked={filterCuisiner === true && filterManger === true && filterAutres === true ? 'checked' : ''}
            onChange={() => checkAll()}
          />
          <span>Tous</span>
        </label>
        <label className="col" htmlFor="filterCuisiner">
          <input
            type="checkbox"
            id="filterCuisiner"
            checked={filterCuisiner ? 'checked' : ''}
            onChange={e => setFilterCuisiner(e.target.checked)}
          />
          <span>Cuisiner</span>
        </label>
        <label className="col" htmlFor="filterManger">
          <input
            type="checkbox"
            id="filterManger"
            checked={filterManger ? 'checked' : ''}
            onChange={e => setFilterManger(e.target.checked)}
          />
          <span>Manger</span>
        </label>
        <label className="col" htmlFor="filterAutres">
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
          <li className="col s2 hide-on-large-only"> </li>
          <li className="col s2 hide-on-med-and-down">Evènement</li>
          <li className="col col-icon s1 hide-on-large-only"><i className="material-icons icon-white">today</i></li>
          <li className="col s1 hide-on-med-and-down">Date/Heure</li>
          <li className="col col-icon s1 hide-on-med-and-down">adultes</li>
          <li className="col col-icon s1 hide-on-med-and-down">enfants</li>
          <li className="col s1 hide-on-med-and-down">capacité</li>
          <li className="col col-icon s1 hide-on-large-only"><i className="material-icons icon-white">people</i></li>
          <li className="col col-icon s1">
            <Tooltip title="email manquant">
              <i className="material-icons icon-white">email</i>
            </Tooltip>
          </li>
          {/* <li className="col col-icon s1">allergies</li> */}
          <li className="col col-icon s1">
            <Tooltip title="allergies">
              <i className="material-icons icon-white">warning</i>
            </Tooltip>
          </li>
          {/* <li className="col col-icon s1">commentaires</li> */}
          <li className="col col-icon s1">
            <Tooltip title="commentaires">
              <i className="material-icons icon-white">comment</i>
            </Tooltip>
          </li>
          <li className="col col-icon s1">
            <Tooltip title="modifier">
              <i className="material-icons icon-white">create</i>
            </Tooltip>
          </li>
          <li className="col col-icon s1">
            <Tooltip title="supprimer">
              <i className="material-icons icon-white">delete_forever</i>
            </Tooltip>
          </li>
          <li className="col col-icon s1"><i className="material-icons">expand_more</i></li>
          {/* <i className="material-icons icon-white">pan_tool</i>
          <i className="material-icons icon-white">restaurant</i>
          <i className="material-icons icon-white">restaurant_menu</i>
          <i className="material-icons icon-white">cake</i>  */}
        </ul>

        {/* liste des evenements */}
        {filteredEvents.map((event, index) => (
          <div className="event" key={event.id_event} data-genre={event.name_event}>
            <ul className="event-item row center-align">
              <li className="col s2">{event.name_event === '' ? event.name_activity : event.name_event}</li>
              <li className="col s1 hide-on-large-only">{moment(event.date_b).format('Do/MM')}</li>
              <li className="col s1 hide-on-med-and-down">
                {moment(event.date_b).format('ddd DD/MM HH:mm-')}
                {moment(event.date_e).format('HH:mm')}
              </li>
              <li className="col col-icon s1 hide-on-med-and-down">{event.nb_adults}</li>
              <li className="col col-icon s1 hide-on-med-and-down">{event.nb_children}</li>
              <li className="col s1">
                {event.nb_persons}
                /
                {event.capacity}
              </li>
              <li className="col col-icon s1">
                {event.nb_emails === event.NB_REG
                  ? null
                  : (
                    <Tooltip title={event.NB_REG - event.nb_emails}>
                      <i className="material-icons warning-icon">email</i>
                    </Tooltip>
                  )
                }
              </li>
              <li className="col col-icon s1">
                {event.nb_allergies > 0
                  ? (
                    <Tooltip title={event.nb_allergies}>
                      <i className="material-icons warning-icon">warning</i>
                    </Tooltip>
                  )
                  : null
                }
              </li>
              <li className="col col-icon s1">
                {event.nb_comments > 0
                  ? (
                    <Tooltip title={event.nb_comments}>
                      <i className="material-icons icon-green">comment</i>
                    </Tooltip>
                  )
                  : null
                }
              </li>
              <li className="col col-icon s1">
                <Link to={`/events/${event.id_event}`}>
                  <i className="material-icons icon-green">create</i>
                </Link>
              </li>

              <li className="col col-icon s1">
                <button
                  type="button"
                  className="button link-button"
                  onClick={() => showDeleteConfirm(index)}
                >
                  <i className="material-icons icon-green">delete_forever</i>
                </button>
              </li>

              <li className="col col-icon s1">
                <button
                  className="btn btn-small home-btn-collapse waves-effect waves-light"
                  onClick={() => {
                    setCollapses([
                      ...collapses.slice(0, [index]),
                      !collapses[index],
                      ...collapses.slice([index + 1], collapses.length),
                    ]);
                  }}
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
                  <ReservationHome
                    eventId={event.id_event}
                    eventName={event.name_event === '' ? event.name_activity : event.name_event}
                    eventDate={event.date_b}
                    registrations={registrations}
                  />
                )
              }
            </ul>

            {/* affiche lien pour nouvelle résa si évènement pas complet */}
            <ul>
              {collapses[index] === true && event.nb_persons < event.capacity
                ? (
                  <li className="create-registration col s12">
                    <Link to="/reservation" homeEvent={event.id_event}>
                      <button
                        className="btn btn-small waves-effect waves-light"
                        type="submit"
                      >
                        créer une nouvelle réservation
                      </button>
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

const mapStateToProps = store => ({
  events: store.events,
  registrations: store.registrations,
});

EventHome.propTypes = {
  dispatch: PropTypes.func,
  events: PropTypes.arrayOf(PropTypes.object),
  registrations: PropTypes.arrayOf(PropTypes.object),
};

EventHome.defaultProps = {
  dispatch: null,
  events: mapStateToProps.events,
  registrations: mapStateToProps.registrations,
};

export default connect(mapStateToProps)(EventHome);
