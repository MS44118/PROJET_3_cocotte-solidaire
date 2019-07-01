import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import moment from 'moment';
import toaster from 'toasted-notes';
import 'moment/locale/fr';
import 'react-dates/initialize';
import { DayPickerSingleDateController } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import isSameDay from 'react-dates/lib/utils/isSameDay';
import './index.css';

const type = document.getElementById('app').getAttribute('type');

function App() {
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

  useEffect(() => {
    axios.get(`http://localhost:8000/api/event/type/${type}`)
      .then((data) => {
        setEventList(data.data);
        setEvents(data.data);
      });
  }, []);

  useEffect(() => {
    let arrayTempFocus = [];
    let arrayTempBlocked = [];
    for (let i = 0; i < eventList.length; i += 1) {
      if (eventList[i].nb_persons >= eventList[i].capacity) {
        arrayTempBlocked = [...arrayTempBlocked, moment(eventList[i].date_b)];
        setBlockedList(arrayTempBlocked);
      } else {
        arrayTempFocus = [...arrayTempFocus, moment(eventList[i].date_b)];
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
    };
    setReservation(reservationTemp);
  }, [numberAdults, numberChildrens, allergie, information,
    lastname, firstname, email, phone, memberId, eventId]);

  const sendReservation = () => {
    setDisplayForm('none');
    if (reservation.numberAdults > 0) {
      axios.post('http://localhost:8000/api/reservation/public/', reservation)
        .then((res) => {
          if (res.status === 200) {
            toaster.notify('Réservation bien enregistrée.', {
              duration: 3000,
            });
          }
        })
        .catch(() => {
          toaster.notify("Problème lors de l'enregistrement de la réservation. Veuillez réessayer.", {
            duration: 3000,
          });
        });
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

    <div>
      <div className="container center">
        <div className="calendar">
          <DayPickerSingleDateController
            daySize={50}
            numberOfMonths={2}
            autoFocus
            hideKeyboardShortcutsPanel
            date={dateSelected || moment()}
            onDateChange={date => setDateSelected(date)}
            isDayHighlighted={day1 => focusList.some(day2 => isSameDay(day1, day2))}
            isDayBlocked={day1 => blockedList.some(day2 => isSameDay(day1, day2))}
            id="reservation_calendar"
          />
        </div>
      </div>
      <div className="container">
        {eventList.length && type <= 2
        && (
          <div className="render">
            <div className="container mssg">
              <p className="center-align subtitles"><span>{eventList[0].name_activity}</span></p>
              <p className="justify text">{eventList[0].description_activity}</p>
              {eventList[0].picture_activity ? <img className="activitie_pics" src={eventList[0].picture_activity} alt="cocotte_activite" /> : ''}
            </div>
          </div>
        )
        }
        {eventList && eventList.map((event, index) => (
          <div>
            {type > 2
              ? (
                <div className="card horizontal" key={event[index]}>
                  <div className="card-image">
                    <img src={event.picture_event ? event.picture_event : event.picture_activity} alt="activitie_pic" />
                  </div>
                  <div className="card-stacked">
                    <span className="card-title title">{event.name_event ? event.name_event : event.name_activity}</span>
                    <div className="card-content">
                      <p>
                        {event.description_event
                          ? event.description_event : event.description_activity}
                      </p>
                    </div>
                    <div className="card-bottom">
                      <p>
                        Places restantes :
                        {event.capacity - event.nb_persons}
                      </p>
                      <p>
                        Date :
                        {moment(event.date_b).locale('fr').format('LLL')}
                      </p>
                    </div>
                    {event.capacity - event.nb_persons <= 0 ? null
                      : (
                        <button
                          type="button"
                          className="waves-effect waves-light btn-small teal darken-1 white-text col right"
                          onClick={() => handleCreate(index)}
                        >
                          RESERVER
                        </button>
                      )
                    }
                  </div>
                </div>
              )
              : (
                <div>
                  <ul className="collection">
                    <li className="collection-item row center-align">
                      <p className="col s3">{event.name_event ? event.name_event : event.name_activity}</p>
                      <p className="col s3">
                        Places restantes :
                        {event.capacity - event.nb_persons}
                      </p>
                      <p className="col s3">
                        Date :
                        {moment(event.date_b).locale('fr').format('LLL')}
                      </p>
                      <p className="col s3">
                        {event.capacity - event.nb_persons <= 0 ? null
                          : (
                            <button
                              type="button"
                              className="waves-effect waves-light btn-small teal darken-1 white-text col right"
                              onClick={() => handleCreate(index)}
                            >
                              RESERVER
                            </button>
                          )
                        }
                      </p>
                    </li>
                  </ul>
                </div>
              )
            }
            <div style={{ display: activeForm[index] ? 'block' : 'none' }}>
              <div className="form">
                <div className="row">
                  <div className="input-field col s6">
                    <select className="browser-default" value={numberAdults} onChange={e => setNumberAdult(e.target.value)}>
                      <option value="0" disabled selected>Nombre d&apos;adultes</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                    </select>
                  </div>
                  <div className="input-field col s6">
                    <select className="browser-default" value={numberChildrens} onChange={e => setNumberChildren(e.target.value)}>
                      <option value="0" disabled selected>Nombres d&apos;enfants</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                    </select>
                  </div>
                </div>
                <div className="row">
                  <div className="input-field col s6">
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
                  <div className="row">
                    <div className="input-field col s6">
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
                <div className="row">
                  <div className="input-field col s6">
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
                  <div className="input-field col s6">
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
                <div className="row">
                  <div className="input-field col s6">
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
                  <div className="row">
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

                    <div className="row">
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
                    <span className="col s10 info">
                      Adhésion obligatoire avec participation libre.
                      Pour gagner du temps, vous pouvez adhérer en ligne via ce bouton.
                      Sinon ce sera directement sur place !
                    </span>
                    <a
                      target="blank"
                      className="waves-effect waves-light btn-small teal darken-1 white-text col s2 right"
                      href="https://www.lacocottesolidaire.fr/adhesion"
                    >
                      ADHERER
                    </a>
                  </div>
                  <span className="col info">Pour les groupes de plus de six personnes, réservez par téléphone au 06 51 49 20 82 !</span>
                  <span className="col merci">merci et à très vite</span>
                </div>
                <div className="row" style={{ display: 'grid', width: '20%' }}>
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
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
