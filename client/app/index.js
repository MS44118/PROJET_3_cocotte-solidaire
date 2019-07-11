import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/fr';
import 'react-dates/initialize';
import { DayPickerSingleDateController } from 'react-dates';
import isSameDay from 'react-dates/lib/utils/isSameDay';
import 'antd/dist/antd.css';
import { message } from 'antd';
import './index.css';

import ThemedStyleSheet from 'react-with-styles/lib/ThemedStyleSheet';
import aphroditeInterface from 'react-with-styles-interface-aphrodite';
import DefaultTheme from 'react-dates/lib/theme/DefaultTheme';

ThemedStyleSheet.registerInterface(aphroditeInterface);
ThemedStyleSheet.registerTheme({
  reactDates: {
    ...DefaultTheme.reactDates,
    color: {
      ...DefaultTheme.reactDates.color,
      highlighted: {
        backgroundColor: '#83bbb4',
        backgroundColor_active: '#498e81',
        backgroundColor_hover: '#498e81',
        color: '#186A3B',
        color_active: '#fff',
        color_hover: '#fff',
      },
    },
  },
});

const type = document.getElementById('app').getAttribute('type');

function useWindowSize() {
  const isClient = typeof window === 'object';
  function getSize() {
    return isClient ? window.innerWidth : undefined;
  }
  const [windowSize, setWindowSize] = useState(getSize);
  useEffect(() => {
    if (!isClient) {
      return false;
    }
    function handleResize() {
      setWindowSize(getSize());
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount
  return windowSize;
}

function App() {
  const size = useWindowSize();
  const [eventList, setEventList] = useState([]);
  const [numberAdults, setNumberAdult] = useState(0);
  const [numberChildrens, setNumberChildren] = useState(0);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [memberId, setMemberId] = useState('');
  const [allergie, setAllergie] = useState('');
  const [information, setInformation] = useState('');
  const [eventId, setEventId] = useState(null);
  const [reservation, setReservation] = useState({});
  const [activeForm, setActiveForm] = useState([]);
  const [displayForm, setDisplayForm] = useState('none');
  const [dateSelected, setDateSelected] = useState('');
  const [focusList, setFocusList] = useState([]);
  const [blockedList, setBlockedList] = useState([]);
  const [events, setEvents] = useState([]);
  const [isOccuped, setIsOccuped] = useState(false);
  const [display, setDisplay] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventDateB, setEventDateB] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:8000/api/event/type/${type}`)
      .then((data) => {
        const eventsTemp = [...data.data];
        for (let i = 0; i < eventsTemp.length; i += 1) {
          if (eventsTemp[i].capacity - eventsTemp[i].nb_persons > 0) {
            eventsTemp[i].placesAvailable = eventsTemp[i].capacity - eventsTemp[i].nb_persons;
          } else {
            eventsTemp[i].placesAvailable = 0;
          }
        }
        setEventList(eventsTemp);
        setEvents(eventsTemp);
        if (type <= 2) {
          setDisplay({ style: 'calendar_center' });
        } else {
          setDisplay({ style: 'calendar_right', orientation: 'vertical', anchorDirection: 'right' });
        }
      });
  }, []);

  useEffect(() => {
    let arrayTempFocus = [];
    let arrayTempBlocked = [];
    for (let i = 0; i < events.length; i += 1) {
      if (events[i].nb_persons >= events[i].capacity) {
        arrayTempBlocked = [...arrayTempBlocked, moment(events[i].date_b)];
        setBlockedList(arrayTempBlocked);
      } else {
        arrayTempFocus = [...arrayTempFocus, moment(events[i].date_b)];
        setFocusList(arrayTempFocus);
      }
    }
  }, [events.length]);

  useEffect(() => {
    const arrayTemp = [];
    if (displayForm === 'none') {
      for (let i = 0; i < eventList.length; i += 1) {
        arrayTemp[i] = false;
        setActiveForm(arrayTemp);
      }
    }
  }, [eventList.length, displayForm]);

  const handleCreate = (index) => {
    const arrayTemp = activeForm;
    arrayTemp[index] = !activeForm[index];
    setActiveForm(arrayTemp);
    setDisplayForm('block');
    setEventId(eventList[index].id_event);
    if (eventList[index].name_event) {
      setEventName(eventList[index].name_event);
    } else {
      setEventName(eventList[index].name_activity);
    }
    setEventDateB(eventList[index].date_b);
  };

  useEffect(() => {
    const reservationTemp = {
      numberAdults,
      numberChildrens,
      allergie,
      information,
      lastname,
      firstname,
      email,
      phone,
      memberId,
      eventId,
      eventName,
      eventDateB,
    };
    setReservation(reservationTemp);
  }, [numberAdults, numberChildrens, allergie, information,
    lastname, firstname, email, phone, memberId, eventId, eventName, eventDateB]);

  const sendReservation = () => {
    setDisplayForm('none');
    if (reservation.numberAdults > 0) {
      axios.post('http://localhost:8000/api/reservation/public/', reservation)
        .then((res) => {
          if (res.status === 200) {
            message.success('Votre réservation a bien été prise en compte', 3);
            const arrayTemp = [...events];
            for (let i = 0; i < arrayTemp.length; i += 1) {
              if (arrayTemp[i].id_event === reservation.eventId) {
                const placesAvail = arrayTemp[i].placesAvailable;
                arrayTemp[i] = {
                  ...arrayTemp[i],
                  placesAvailable:
                  (placesAvail - reservation.numberAdults - reservation.numberChildrens / 2),
                };
              }
            }
            setEvents(arrayTemp);
            setEventList(arrayTemp);
          }
        })
        .catch(() => {
          message.error("Une erreur s'est produite lors de votre réservation. Merci de réessayer", 3);
        });
    } else {
      message.error('Veuillez ajouter au moins un adulte.', 3);
    }
    setNumberAdult(0);
    setNumberChildren(0);
    setAllergie('');
    setInformation('');
    setLastname('');
    setFirstname('');
    setEmail('');
    setPhone('');
    setMemberId('');
    setEventId(null);
    setAllergie('');
    setInformation('');
  };

  useEffect(() => {
    let numDateOccuped = 0;
    for (let i = 0; i < focusList.length; i += 1) {
      if (moment(dateSelected).format('YYYY-MM-DD') === moment(focusList[i]).format('YYYY-MM-DD') || moment(dateSelected).format('YYYY-MM-DD') === moment(blockedList[i]).format('YYYY-MM-DD')) {
        numDateOccuped += 1;
      }
    }
    if (numDateOccuped > 0) {
      setIsOccuped(true);
    } else {
      setIsOccuped(false);
    }
  }, [dateSelected]);

  useEffect(() => {
    if (isOccuped) {
      const array = events.filter(event => moment(event.date_b).format('YYYY-MM-DD') === moment(dateSelected).format('YYYY-MM-DD'));
      setEventList(array);
    } else {
      setEventList(events);
    }
  }, [isOccuped, dateSelected]);

  return (

    <div className={`container-${display.style}`}>
      <div className={`container center hidden-${display.style}`}>
        {eventList.length && type <= 2
        && (
          <div className="render">
            <div className="container mssg">
              <h1 className="center-align subtitles"><span>{eventList[0].name_activity}</span></h1>
              <p className="justify text">{eventList[0].description_activity}</p>
              <p>
                Lieu :
                {eventList[0].address_event}
              </p>
              {eventList[0].picture_activity ? <img className="activitie_pics" src={eventList[0].picture_activity} alt="cocotte_activite" /> : ''}
            </div>
          </div>
        )}
        <div className={display.style}>
          {eventList.length && type <= 2 && size > 768
          && (
            <DayPickerSingleDateController
              daySize={50}
              numberOfMonths={2}
              autoFocus
              hideKeyboardShortcutsPanel
              date={dateSelected || moment()}
              onDateChange={date => setDateSelected(date)}
              isDayHighlighted={day1 => focusList.some(day2 => isSameDay(day1, day2))}
              isDayBlocked={day1 => blockedList.some(day2 => isSameDay(day1, day2))}
              id="reservation_calendar_type_less2"
            />
          )}
        </div>
      </div>
      <div className={`container cards-${display.style}`}>
        {eventList.length && size <= 768
          && (
            <div className="calendar-mobile">
              <DayPickerSingleDateController
                daySize={30}
                numberOfMonths={1}
                autoFocus
                hideKeyboardShortcutsPanel
                date={dateSelected || moment()}
                onDateChange={date => setDateSelected(date)}
                isDayHighlighted={day1 => focusList.some(day2 => isSameDay(day1, day2))}
                isDayBlocked={day1 => blockedList.some(day2 => isSameDay(day1, day2))}
                id="reservation_calendar_mobile"
              />
            </div>
          )}
        {eventList && eventList.map((event, index) => (
          <div>
            {type > 2
              ? (
                <div className={`card ${size < 768 ? null : 'horizontal'}`} key={event[index]}>
                  <div className="card-image">
                    <img src={event.picture_event ? event.picture_event : event.picture_activity} alt="pic-event" />
                  </div>
                  <div className="card-stacked">
                    <span className="card-title title">{event.name_event ? event.name_event : event.name_activity}</span>
                    <div className="card-content">
                      <p>
                        {event.description_event
                          ? event.description_event
                          : event.description_activity}
                      </p>
                    </div>
                    <div className="card-bottom">
                      <p>
                        Places restantes :
                        {event.placesAvailable}
                      </p>
                      <p>
                        Date :
                        {moment(event.date_b).locale('fr').format('LLL')}
                      </p>
                      <p>
                        Lieu :
                        {event.address_event}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="waves-effect waves-light btn-small teal darken-1 white-text col right card-button"
                      onClick={() => handleCreate(index)}
                      disabled={event.placesAvailable <= 0 || false}
                    >
                      RESERVER
                    </button>
                  </div>
                </div>
              )
              : (
                <div>
                  <ul className="collection">
                    <li className="collection-item row center-align">
                      <p className="col s6 m3">{event.name_event ? event.name_event : event.name_activity}</p>
                      <p className="col s6 m3">
                        Places restantes :
                        {event.placesAvailable}
                      </p>
                      <p className="col s6 m3">
                        Date :
                        {moment(event.date_b).locale('fr').format('LLL')}
                      </p>
                      <p className="col s6 m3">
                        <button
                          type="button"
                          className="waves-effect waves-light btn-small teal darken-1 white-text col right"
                          onClick={() => handleCreate(index)}
                          disabled={event.placesAvailable <= 0 || false}
                        >
                          RESERVER
                        </button>
                      </p>
                    </li>
                  </ul>
                </div>
              )}
            <div style={{ display: activeForm[index] ? 'block' : 'none' }}>
              <div className="form">
                <div className="row">
                  <div className="input-field col s12 m6">
                    <select className="browser-default form-item" value={numberAdults} onChange={e => setNumberAdult(e.target.value)}>
                      <option value="0" disabled selected>Nombre d&apos;adultes</option>
                      <option value="1">1</option>
                      <option value="2" disabled={event.placesAvailable - numberChildrens / 2 < 2 || false}>2</option>
                      <option value="3" disabled={event.placesAvailable - numberChildrens / 2 < 3 || false}>3</option>
                      <option value="4" disabled={event.placesAvailable - numberChildrens / 2 < 4 || false}>4</option>
                      <option value="5" disabled={event.placesAvailable - numberChildrens / 2 < 5 || false}>5</option>
                      <option value="6" disabled={event.placesAvailable - numberChildrens / 2 < 6 || false}>6</option>
                    </select>
                  </div>
                  <div className="input-field col s12 m6">
                    <select className="browser-default form-item" value={numberChildrens} onChange={e => setNumberChildren(e.target.value)}>
                      <option value="0" disabled selected>Nombres d&apos;enfants (1/2 place)</option>
                      <option value="1" disabled={event.placesAvailable - numberAdults < 1 || false}>1</option>
                      <option value="2" disabled={event.placesAvailable - numberAdults < 1 || false}>2</option>
                      <option value="3" disabled={event.placesAvailable - numberAdults < 2 || false}>3</option>
                      <option value="4" disabled={event.placesAvailable - numberAdults < 2 || false}>4</option>
                      <option value="5" disabled={event.placesAvailable - numberAdults < 3 || false}>5</option>
                      <option value="6" disabled={event.placesAvailable - numberAdults < 3 || false}>6</option>
                    </select>
                  </div>
                </div>
                <div className="row form-item">
                  <div className="input-field col s12 m6">
                    <i className="material-icons prefix">account_circle</i>
                    <input
                      id="last_name"
                      type="text"
                      className="validate"
                      value={lastname}
                      onChange={(e) => {
                        setLastname(e.target.value);
                      }}
                    />
                    <label id="last_name" htmlFor="last_name">Nom</label>
                  </div>
                  <div className="row form-item">
                    <div className="input-field col s12 m6">
                      <i className="material-icons prefix">account_circle</i>
                      <input
                        type="text"
                        id="firstname"
                        className="validate"
                        onChange={e => setFirstname(e.target.value)}
                        value={firstname}
                      />
                      <label htmlFor="firstname">Prénom</label>
                    </div>
                  </div>
                </div>
                <div className="row form-item">
                  <div className="input-field col s12 m6">
                    <i className="material-icons prefix">phone</i>
                    <input
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      id="icon_telephone"
                      type="tel"
                      className="validate"
                    />
                    <label htmlFor="icon_telephone">
                      Téléphone
                    </label>
                  </div>
                  <div className="input-field col s12 m6">
                    <i className="material-icons prefix">email</i>
                    <input
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      id="email"
                      type="email"
                      className="validate"
                    />
                    <label htmlFor="email">
                      Email
                    </label>
                  </div>
                </div>
                <div className="row form-item">
                  <div className="input-field col s12 m6">
                    <i className="material-icons prefix">person_add</i>
                    <input
                      value={memberId}
                      onChange={e => setMemberId(e.target.value)}
                      id="member_id"
                      type="text"
                      className="validate"
                    />
                    <label htmlFor="member_id">
                      Numéro d&apos;adhérent
                    </label>
                  </div>
                  <div className="row form-item">
                    <div className="row">
                      <div className="input-field col s12">
                        <i className="material-icons prefix">notification_important</i>
                        <textarea
                          id="allergy"
                          className="materialize-textarea"
                          onChange={e => setAllergie(e.target.value)}
                        />
                        <label htmlFor="allergy">
                          Allergies
                        </label>
                      </div>
                    </div>
                    <div className="row form-item">
                      <div className="input-field col s12">
                        <i className="material-icons prefix">info</i>
                        <input
                          type="text"
                          id="importantInfo"
                          className="validate"
                          data-length="100%"
                          onChange={e => setInformation(e.target.value)}
                        />
                        <label htmlFor="importantInfo">
                          Informations complémentaires
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="row">
                    <p className="col s12 m10">
                      Adhésion obligatoire avec participation libre.
                      Pour gagner du temps, vous pouvez adhérer en ligne via ce bouton.
                      Sinon ce sera directement sur place !
                    </p>
                    <a
                      style={{ marginTop: '15px' }}
                      target="blank"
                      className="waves-effect waves-light btn-small teal darken-1 white-text col s6 m2 right"
                      href="https://www.lacocottesolidaire.fr/adhesion"
                    >
                      ADHERER
                    </a>
                  </div>
                  <p className="col">Pour les groupes de plus de six personnes, réservez par téléphone au 06 51 49 20 82 !</p>
                  <h4 className="col merci">MERCI ET A TRES VITE</h4>
                </div>
                <div className="row send">
                  <button
                    type="button"
                    className="waves-effect waves-light btn-small teal darken-1 white-text"
                    onClick={() => sendReservation(index)}
                  >
                    ENVOYER
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {eventList.length && type > 2 && size > 768
      && (
        <div className={`calendar-${display.style}`}>
          <DayPickerSingleDateController
            daySize={50}
            numberOfMonths={2}
            autoFocus
            orientation={display.orientation}
            hideKeyboardShortcutsPanel
            date={dateSelected || moment()}
            onDateChange={date => setDateSelected(date)}
            isDayHighlighted={day1 => focusList.some(day2 => isSameDay(day1, day2))}
            isDayBlocked={day1 => blockedList.some(day2 => isSameDay(day1, day2))}
            id="reservation_calendar_type_more2"
          />
        </div>
      )}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
