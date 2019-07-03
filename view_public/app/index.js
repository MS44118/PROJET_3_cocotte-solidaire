import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/fr';
import 'react-dates/initialize';
import { DayPickerSingleDateController } from 'react-dates';
import isSameDay from 'react-dates/lib/utils/isSameDay';
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
  const [date, setDate] = useState('');
  const [focusList, setFocusList] = useState([]);
  const [blockedList, setBlockedList] = useState([]);
  const [events, setEvents] = useState([]);
  const [isOccuped, setIsOccuped] = useState(false);
  const [display, setDisplay] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:8000/api/event/type/${type}`)
      .then((data) => {
        let eventsTemp = [...data.data];
        for (let i = 0; i < eventsTemp.length; i+=1){
          eventsTemp[i].placesAvailable = eventsTemp[i].capacity - eventsTemp[i].nb_persons
        }
        console.log(eventsTemp)
        setEventList(eventsTemp);
        setEvents(eventsTemp);
        if(type <= 2){
          setDisplay({ style: 'calendar_center' })
        } else {
          setDisplay({ style: 'calendar_right', orientation: 'vertical', anchorDirection: 'right' })
        }
      });
  }, []);

  useEffect(() => {
    let arrayTempFocus = [];
    let arrayTempBlocked = [];
    for (let i = 0; i < events.length; i++) {
      if (events[i].nb_persons >= events[i].capacity) {
        arrayTempBlocked = [...arrayTempBlocked, moment(events[i].date_b)]
        setBlockedList(arrayTempBlocked);
      } else {
        arrayTempFocus = [...arrayTempFocus, moment(events[i].date_b)]
        setFocusList(arrayTempFocus);
      }
    }
  }, [events.length])

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
    setEventId(eventList[index].id_event)
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
  }, [numberAdults, numberChildrens, allergie, information, lastname, firstname, email, phone, memberId, eventId]);

  const sendReservation = () => {
    setDisplayForm('none');
    console.log(reservation)
    reservation.numberAdults > 0 && axios.post('http://localhost:8000/api/reservation/public/', reservation)
      .then((res) => {
        console.log(res.statusText);
      })
      .catch((error) => {
        console.log(error);
      });
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
  }

  useEffect(() => {
    let numDateOccuped = 0;
    for (let i = 0; i < focusList.length; i++) {
      if (moment(date).format('YYYY-MM-DD') === moment(focusList[i]).format('YYYY-MM-DD') || moment(date).format('YYYY-MM-DD') === moment(blockedList[i]).format('YYYY-MM-DD')) {
        numDateOccuped += 1
      }
    }
    if (numDateOccuped > 0) {
      setIsOccuped(true)
    } else {
      setIsOccuped(false)
    }
  }, [date]);

  useEffect(() => {
    if (isOccuped) {
      const array = events.filter(event => moment(event.date_b).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD'));
      setEventList(array)
    } else {
      setEventList(events)
    }
  }, [isOccuped, date])

  return (

    <div className={`container-${display.style}`}>
      <div className="container center" className={`hidden-${display.style}`}>
        {eventList.length && type <=2 &&
          <div className="render">
            <div className="container mssg">
              <h1 className="center-align subtitles"><span>{eventList[0].name_activity}</span></h1>
              <p className="justify text">{eventList[0].description_activity}</p>
              {eventList[0].picture_activity ? <img className="activitie_pics" src={eventList[0].picture_activity} alt="cocotte_activite" /> : ''}
            </div>
          </div>
        }
        <div className={display.style} >
        {eventList.length && type <=2 && 
          <DayPickerSingleDateController
            daySize={50}
            numberOfMonths={2}
            autoFocus
            hideKeyboardShortcutsPanel
            date={date ? date : moment()}
            onDateChange={date => setDate(date)}
            isDayHighlighted={day1 => focusList.some(day2 => isSameDay(day1, day2))}
            isDayBlocked={day1 => blockedList.some(day2 => isSameDay(day1, day2))}
            id="reservation_calendar"
          />}
        </div>
      </div>
      <div className="container" className={`cards-${display.style}`} >
        {eventList && eventList.map((event, index) => (
          <div>
            {type > 2 ?
              <div className="card horizontal" key={event[index]}>
                <div className="card-image">
                  <img src={event.picture_event ? event.picture_event : event.picture_activity} />
                </div>
                <div className="card-stacked">
                  <span className="card-title">{event.name_event ? event.name_event : event.name_activity}</span>
                  <div className="card-content-first">
                    <p>{event.description_event ? event.description_event : event.description_activity}</p>
                  </div>
                  <div className="card-content-second">
                    <p>Places restantes : {event.placesAvailable}</p>
                    <p>Date : {moment(event.date_b).locale('fr').format('LLL')}</p>
                  </div>
                    <button
                      className="card-button"
                      type="button"
                      className="waves-effect waves-light btn-small teal darken-1 white-text col right"
                      onClick={() => handleCreate(index)}
                      disabled={event.placesAvailable <= 0 ? true : false}
                    >
                      RESERVER
                 </button>

                </div>
              </div>
              :
              <div>
                <ul className="collection">
                  <li className="collection-item row center-align">
                    <p className="col s3">{event.name_event ? event.name_event : event.name_activity}</p>
                    <p className="col s3">Places restantes : {event.placesAvailable}</p>
                    <p className="col s3">Date : {moment(event.date_b).locale('fr').format('LLL')}</p>
                    <p className="col s3">
                        <button
                          type="button"
                          className="waves-effect waves-light btn-small teal darken-1 white-text col right"
                          onClick={() => handleCreate(index)}
                          disabled={event.placesAvailable <= 0 ? true : false}
                        >
                          RESERVER
                 </button>
                    </p>
                  </li>
                </ul>
              </div>
            }
            <div style={{ display: activeForm[index] ? 'block' : 'none' }}>
              <div className="form">
                <div className="row">
                  <div className="input-field col s6">
                    <select className='browser-default form-item' value={numberAdults} onChange={e => setNumberAdult(e.target.value)}>
                      <option value="0" disabled selected>Nombre d'adultes</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                    </select>
                  </div>
                  <div className="input-field col s6">
                    <select className='browser-default form-item' value={numberChildrens} onChange={e => setNumberChildren(e.target.value)}>
                      <option value="0" disabled selected>Nombres d'enfants</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                    </select>
                  </div>
                </div>
                <div className="row form-item">
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
                  <div className="row form-item">
                    <div className="input-field col s6">
                      <i className="material-icons prefix">account_circle</i>
                      <input
                        type="text"
                        id="firstname"
                        className="validate"
                        onChange={e => setFirstname(e.target.value)}
                        value={firstname}
                      />
                      <label htmlFor="firstname" >Prénom</label>
                    </div>
                  </div>
                </div>
                <div className='row form-item'>
                  <div className="input-field col s6">
                    <i className="material-icons prefix">phone</i>
                    <input
                      value={phone}
                      onChange={event => setPhone(event.target.value)}
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
                      onChange={event => setEmail(event.target.value)}
                      id="email"
                      type="email"
                      className="validate"
                    />
                    <label htmlFor="email">
                      Email
                    </label>
                  </div>
                </div>
                <div className='row form-item'>
                  <div className="input-field col s6">
                    <i className="material-icons prefix">person_add</i>
                    <input
                      value={memberId}
                      onChange={event => setMemberId(event.target.value)}
                      id="member_id"
                      type="text"
                      className="validate"
                    />
                    <label htmlFor="member_id">
                      Numéro d'adhérent
                    </label>
                  </div>
                  <div className='row form-item'>
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
                <div className='row'>
                  <div className='row'>
                    <p className="col s10">
                      Adhésion obligatoire avec participation libre.
                      Pour gagner du temps, vous pouvez adhérer en ligne via ce bouton. Sinon ce sera directement sur place !
                  </p>
                    <a
                      style={{ marginTop: '15px' }}
                      target="_blank"
                      className="waves-effect waves-light btn-small teal darken-1 white-text col s2 right"
                      href="https://www.lacocottesolidaire.fr/adhesion"
                    >
                      ADHERER
                  </a>
                  </div>
                  <p className='col'>Pour les groupes de plus de six personnes, réservez par téléphone au 06 51 49 20 82 !</p>
                  <h4 className='col merci'>MERCI ET A TRES VITE</h4>
                </div>
                <div className='row send'>
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
      {eventList.length && type > 2  && 
      <div className={`calendar-${display.style}`}>
        <DayPickerSingleDateController
          daySize={50}
          numberOfMonths={2}
          autoFocus
          orientation={display.orientation}
          hideKeyboardShortcutsPanel
          date={date ? date : moment()}
          onDateChange={date => setDate(date)}
          isDayHighlighted={day1 => focusList.some(day2 => isSameDay(day1, day2))}
          isDayBlocked={day1 => blockedList.some(day2 => isSameDay(day1, day2))}
          id="reservation_calendar"
        />
        </div>
        }
    </div>


  )
}

ReactDOM.render(<App />, document.getElementById('app'))