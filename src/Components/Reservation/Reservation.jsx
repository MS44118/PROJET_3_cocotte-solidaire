import axios from 'axios';
import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css/dist/js/materialize';
import React, { useEffect, useState } from 'react';
import { Search } from 'semantic-ui-react';
import 'semantic-ui/dist/semantic.min.css';
import moment from 'moment';
import 'moment/locale/fr';
import './Reservation.css';

function Reservation() {

  const [events, setEvent] = useState([]);
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [memberNumber, setMemberNumber] = useState();
  const [phone, setPhone] = useState('');
  const [idUser, setIdUser] = useState('');
  const [numberAdultReservation, setnumberAdultReservation] = useState();
  const [numberchildrenReservation, setnumbeChildrenRegistration] = useState(0);
  const [reservationAllergie, setReservationAllergie] = useState('');
  const [reservationInfo, setReservationInfo] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([{ title: '', id: '' }]);
  const [labelActive, setLabelActive] = useState('');
  const [eventId, setEventId] = useState(0);
  const [existantUser, setExistantUser] = useState(false);
  const [disableInput, setDisableInput] = useState(false);


  useEffect(() => {
    M.AutoInit();

    axios.get('http://localhost:8000/users')
      .then((result) => {
        setUsers(result.data);
      });
    axios.get('http://localhost:8000/events')
      .then((result) => {
        setEvent(result.data);

      });

  },
  []);

  const addReservation = {
    numberAdultReservation,
    numberchildrenReservation,  
    reservationAllergie,
    reservationInfo,
    lastname,
    firstname,
    email,
    phone,
    idUser,
    existantUser,
    eventId,
    memberNumber,

  };
axios.put(`http://localhost:8000/zob/${idUser}`,addReservation)
          .then(function (response){
            console.log(response)
          })
          .then(function(err){
            console.log(err)
          })
  const sendForm = () => {
    axios.post('http://localhost:8000/zboub/', addReservation)
      .then(function (response) {
        console.log(response)})
      .then(function (err) {
        console.log(err)})  
  };

  useEffect(() => {
    if (searchValue.length > 0) {
      const arrayTemp = users.filter(user => user.lastname.toLowerCase().includes(`${searchValue.toLowerCase()}`) || user.firstname.toLowerCase().startsWith(`${searchValue.toLowerCase()}`));
      
      let resultTemp = [];
      for (let i = 0; i < arrayTemp.length; i++) {
      
        resultTemp = [...resultTemp, { title: `${arrayTemp[i].lastname} ${arrayTemp[i].firstname}`, id: arrayTemp[i].idUser }];
      }
      setSearchResults(resultTemp);

      
    }
  }, [searchValue]);

  const handleUser = (e, { result } )=> {
    
    const arrayTemp = users.filter(user => user.idUser  === result.id);
    setFirstname(arrayTemp[0].firstname);
    setLastname(arrayTemp[0].lastname);
    setEmail(arrayTemp[0].email);
    setPhone(arrayTemp[0].phone);
    setMemberNumber(arrayTemp[0].member_id)
    setIdUser(arrayTemp[0].idUser);
    setMemberNumber(arrayTemp[0].memberId)
    setLabelActive('active');
    setExistantUser(true);
    // setDisableInput(true);
    console.log(arrayTemp[0]);
  }

  return (

    <div className="container">
      <h1>Réservation</h1>
      <div className="row">
        <div className="input-field  col s8">

        </div>
        <div className="input-field col s4 mr-8">
          <button
            type="submit"
            className="waves-effect waves-light btn-small teal white-text right "
            onClick={sendForm}
          >
            Envoyer
          </button>
        </div>
      </div>  
      <div className="row">
      <div className="input-field col s6">
      <p>place disponibles :{events.capacity}</p>
         </div>
        <div className="input-field col s6">
        <select id="events" className="browser-default color_select" value= {eventId} onChange={(events) => setEventId(events.target.value)}>
            {events.map((event, index) =>
           <option key={event[index]}  value={event.id_event} >{event.name_event} : {moment(event.date_b).calendar()} </option>
            )};
           </select> 

        </div>

      </div>
      <div className=" row ">
        <div className="col s4 txt ">
          <p>Places à réserver</p>
        </div>
        <div className="input-field col s4">
          <p> nombres d&apos;Adultes</p>
          <select onChange={e => setnumberAdultReservation(e.target.value)}>
            <option value="0" disabled selected>Nombre Adultes</option>
            <option value={1}>1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>

        </div>
        <div className="input-field col s4">
          <p>Nombres d&apos;enfants</p>
          <select onChange={e => setnumbeChildrenRegistration(e.target.value)}>
            <option value="0" disabled selected>Nombres Enfants</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>

        </div>
        <Search
          onSearchChange={event => setSearchValue(event.target.value)}
          type="text"
          value={searchValue}
          results={searchResults}
          onResultSelect={(e, { result }) => handleUser(e, { result })}
          size="big"
          icon="none"
          placeholder="nom de famille"
        />

      </div>
      {/* choose event collaps bar */}
      <div className="row">

        <div className="input-field col s6">
          <i className="material-icons prefix">account_circle</i>
          <input
            id="last_name"
            type="text"
            className="validate"
            value={lastname}
            disabled={disableInput}
            onChange={(e) => {
              setLastname(e.target.value);
            }}
          />
          <label id="last_name" htmlFor="last_name" className={labelActive}>
            Nom
          </label>
        </div>
        <div className="row">
          <div className="input-field col s6">
            <i className="material-icons prefix">account_circle</i>
            <input
              type="text"
              id="firstname"
              disabled={disableInput}
              className="validate"
              onChange={e => setFirstname(e.target.value)}
              value={firstname}
            />
            <label htmlFor="firstname" className={labelActive}>Prénom</label>
          </div>
        </div>
      </div>


      {/* row name mail and tel */}
      <div className="row">
        <div className="input-field col s6">
          <i className="material-icons prefix">email</i>
          <input
            id="email"
            type="email"
            disabled={disableInput}
            className="validate"
            onChange={e => setEmail(e.target.value)}
            value={email}
          />
          <label htmlFor="email" className={labelActive} >
            Email
            </label>
        </div>

        <div className="input-field col s6">
          <i className="material-icons prefix">phone</i>
          <input
            id="icon_telephone"
            disabled={disableInput}
            type="tel"
            className="validate"
            onChange={e => setPhone(e.target.value)}
            value={phone}
          />
          <label htmlFor="icon_telephone" className={labelActive} >
            Téléphone
          </label>
        </div>
      </div>
      <div className="row">
        <div className="input-field col s6">
          <i className="material-icons prefix">person_add</i>
          <input
            id="num_user"
            type="text"
            disabled={disableInput}
            className="validate"
            onChange={e => setMemberNumber(e.target.value)}
            value={memberNumber}
          />
          <label htmlFor="num_user" className={labelActive} >
            Numéros d&apos;adhérent
          </label>
        </div>
      </div>

      <div className="row">
        <div className="input-field col s12">
          <i className="material-icons prefix">notification_important</i>
          <textarea
            id="allergy"
            className="materialize-textarea"
            onChange={e => setReservationAllergie(e.target.value)}
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
            onChange={e => setReservationInfo(e.target.value)}
          />
          <label htmlFor="importantInfo">
            Informations complémentaires
          </label>
        </div>
      </div>
    </div>

  );
};

export default Reservation;
