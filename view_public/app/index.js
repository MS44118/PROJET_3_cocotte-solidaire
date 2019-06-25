import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import moment from 'moment';

const type = document.getElementById('app').getAttribute('type');

function App() {
  const [events, setEvents] = useState([]);
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

  useEffect(() => {
    axios.get(`http://localhost:8000/api/event/type/${type}`)
      .then((data) => {
        setEvents(data.data);
      });
  }, []);

  useEffect(() => {
    const arrayTemp = [];
    if (displayForm === 'none') {
      for (let i = 0; i < events.length; i += 1) {
        arrayTemp[i] = false;
        setActiveForm(arrayTemp);
      }
    }
  }, [events.length, displayForm]);

  const handleCreate = (index) => {
    const arrayTemp = activeForm;
    arrayTemp[index] = !activeForm[index];
    setActiveForm(arrayTemp);
    setDisplayForm('block');
    setEventId(events[index].id_event)
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
    reservation.numberAdults >0 && axios.post('http://localhost:8000/api/reservation/public/', reservation)
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

  return (

    <div className="container">
      <h1>Vue publique</h1>
      {events && events.map((event, index) => (
        <div>
          <div className="card horizontal" key={event[index]}>
            <div className="card-image">
              <img src={event.picture_event ? event.picture_event : event.picture_activity} />
            </div>
            <div className="card-stacked">
              <span className="card-title" style={{ marginLeft: '20px', marginTop: '5px' }}>{event.name_event ? event.name_event : event.name_activity}</span>
              <div className="card-content" style={{ paddingTop: '5px' }}>
                <p>{event.description_event ? event.description_event : event.description_activity}</p>
              </div>
              <div className="card-content" style={{ verticalAlign: 'bottom', paddingBottom: '0px' }}>
                <p>Places restantes : {event.capacity - event.nb_persons}</p>
                <p>Date : {moment(event.date_b).locale('fr').format('LLL')}</p>
              </div>
              <button
                type="button"
                className="waves-effect waves-light btn-small teal darken-1 white-text col right"
                onClick={() => handleCreate(index)}
              >
                RESERVER
                </button>
            </div>
          </div>

          <div style={{ display: activeForm[index] ? 'block' : 'none' }}>
            <div style={{ borderColor: '#83bbb4', borderStyle: 'solid', borderWidth: '10px', padding: '20px' }}>
              <div className="row">
                <div className="input-field col s6">
                  <select className='browser-default' style={{ color: '#498e81' }} value={numberAdults} onChange={e => setNumberAdult(e.target.value)}>
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
                  <select className='browser-default' style={{ color: '#498e81' }} value={numberChildrens} onChange={e => setNumberChildren(e.target.value)}>
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
              <div className="row" style={{ color: '#498e81' }}>
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
                    <label htmlFor="firstname" >Prénom</label>
                  </div>
                </div>
              </div>
              <div className='row' style={{ color: '#498e81' }}>
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
              <div className='row' style={{ color: '#498e81' }}>
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
                <div className='row'>
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
              <div className='row'>
                <div className='row'>
                  <p className="col s10">Pour gagner du temps, vous pouvez adhérer en ligne via ce bouton. Sinon ce sera directement sur place !</p>
                  <button
                    type="button"
                    style={{ marginTop: '15px' }}
                    className="waves-effect waves-light btn-small teal darken-1 white-text col s2 right"
                    onClick={''}
                  >
                    ADHERER
                </button>
                </div>
                <p className='col'>Pour les groupes de plus de six personnes, réservez par téléphone au 06 51 49 20 82 !</p>
                <h4 className='col' style={{ color: '#F8C8BE' }}>MERCI ET A TRES VITE</h4>
              </div>
              <div className='row' style={{ display: 'grid', width: '20%' }}>
                <button
                  type="button"
                  className="waves-effect waves-light btn-small teal darken-1 white-text col center"
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


  )
}

ReactDOM.render(<App />, document.getElementById('app'))