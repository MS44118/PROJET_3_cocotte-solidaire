import axios from 'axios';
import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css/dist/js/materialize';
import React, { useEffect, useState } from 'react';
import { Search } from 'semantic-ui-react';
import 'semantic-ui/dist/semantic.min.css';
import moment from 'moment';
import './Reservation.css';
import 'moment/locale/fr';
import { stringLiteral } from '@babel/types';
import queryString from 'query-string';
import { withRouter } from 'react-router';

function Reservation(props) {

  const [events, setEvent] = useState([]);
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [memberNumber, setMemberNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [idUser, setIdUser] = useState();
  const [quantityAdult, setQuantityAdult] = useState();
  const [quantityChildren, setQuantityChildren] = useState(0);
  const [allergies, setAllergies] = useState('');
  const [comment, setComment] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([{ title: '', id: '' }]);
  const [labelActive, setLabelActive] = useState('');
  const [eventId, setEventId] = useState(0);
  const [existantUser, setExistantUser] = useState(false);
  const [disableInput, setDisableInput] = useState(false);
  const [registration, setRegistration] = useState(0);

  // ESLINT WARNING: to prevent definitions of unused prop types
  const [resaProps, setResaProps] = useState({});
  useEffect(() => setResaProps(props), [props]);

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
  }, []);

  const addReservation = {
    quantityAdult,
    quantityChildren,
    allergies,
    comment,
    lastname,
    firstname,
    email,
    phone,
    idUser,
    existantUser,
    eventId,
    memberNumber,
  };
  axios.put(`http://localhost:8000/zob/${idUser}`, addReservation)
    .then((response) => {
      console.log(response);
    })
    .then((err) => {
      console.log(err);
    });
  const sendForm = () => {
    axios.post('http://localhost:8000/zboub/', addReservation)
      .then((response) => {
        console.log(response);
      })
      .then((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (searchValue.length > 0) {
      const arrayTemp = users.filter(user => user.lastname.toLowerCase().includes(`${searchValue.toLowerCase()}`) || user.firstname.toLowerCase().startsWith(`${searchValue.toLowerCase()}`));
      let resultTemp = [];
      for (let i = 0; i < arrayTemp.length; i += 1) {
        resultTemp = [...resultTemp, { title: `${arrayTemp[i].lastname} ${arrayTemp[i].firstname}`, id: arrayTemp[i].idUser }];
      }
      setSearchResults(resultTemp);
    }
    if (searchValue.length === 0) {
      setDisableInput(false);
    } else {
      setDisableInput(true);
      setLabelActive('active');
    }
  }, [searchValue]);

  useEffect(() => {
    const params = queryString.parse(resaProps.location.search);
    let registrationId = params.id;

    axios.get(`http://localhost:8000/registration/${registrationId}`)
      .then((data) => {
        setRegistration(data.data);
        console.log(data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [resaProps.location.search]);

  useEffect(() => {
    if (registration.length > 0) {
      setQuantityAdult(registration[0].quantity_adult);
      setQuantityChildren(registration[0].quantity_children);
      setAllergies(registration[0].allergie);
      setComment(registration[0].comment);
      setFirstname(registration[0].firstname);
      setLastname(registration[0].lastname);
      setEmail(registration[0].email);
      setPhone(registration[0].phone);
      setMemberNumber(registration[0].member_id);
      setEventId(registration[0].id_event);
      setLabelActive('active');
      // setDisableInput(true)
    }
  }, [registration]);

  console.log(registration);

  const handleUser = (e, { result }) => {
    const arrayTemp = users.filter(user => user.idUser === result.id);
    setFirstname(arrayTemp[0].firstname);
    setLastname(arrayTemp[0].lastname);
    setEmail(arrayTemp[0].email);
    setPhone(arrayTemp[0].phone);
    setMemberNumber(arrayTemp[0].member_id);
    setIdUser(arrayTemp[0].idUser);
    setMemberNumber(arrayTemp[0].memberId);
    setExistantUser(true);
  };

  return (

    <div className="container">
      <h1>Réservation</h1>
      <div className="row">
        {/* <div className="input-field  col s8">

        </div> */}
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
          <p>
            {'place disponibles :'}
            {events.capacity}
          </p>
        </div>
        <div className="input-field col s6">
          <select id="events" className="browser-default color_select" value={eventId} onChange={events => setEventId(events.target.value)}>
            {events.map((event, index) => (
              <option key={event[index]} value={event.id_event}>
                {`${event.name_event} : ${moment(event.date_b).calendar()}`}
              </option>
            ))}
          </select>

        </div>

      </div>
      <div className=" row ">
        <div className="col s4 txt ">
          <p>Places à réserver</p>
        </div>
        <div className="input-field col s4">
          <p> nombres d&apos;Adultes</p>
          <select value ={quantityAdult} onChange={e => setQuantityAdult(e.target.value)}>
            <option value="0" disabled selected>Nombres Adultes</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>

        </div>
        <div className="input-field col s4">
          <p>Nombres d&apos;enfants</p>
          <select onChange={e => setQuantityChildren(e.target.value)}>
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
            onChange={(e) => {
              setLastname(e.target.value);
            }}
            value={lastname}
            disabled={disableInput}
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
              className="validate"
              onChange={e => setFirstname(e.target.value)}
              value={firstname}
              disabled={disableInput}
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
            className="validate"
            onChange={e => setEmail(e.target.value)}
            value={email}
            disabled={disableInput}
          />
          <label htmlFor="email" className={labelActive}>
            Email
          </label>
        </div>

        <div className="input-field col s6">
          <i className="material-icons prefix">phone</i>
          <input
            id="icon_telephone"
            type="tel"
            className="validate"
            onChange={e => setPhone(e.target.value)}
            value={phone}
            disabled={disableInput}
          />
          <label htmlFor="icon_telephone" className={labelActive}>
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
            className="validate"
            onChange={e => setMemberNumber(e.target.value)}
            disabled={disableInput}
            value={memberNumber}
          />
          <label htmlFor="num_user" className={labelActive}>
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
            onChange={e => setAllergies(e.target.value)}
            value={allergies}
          />
          <label htmlFor="allergy" className={labelActive}>
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
            data-length="100%"
            onChange={e => setComment(e.target.value)}
            value={comment}
          />
          <label htmlFor="importantInfo" className={labelActive}>
            Informations complémentaires
          </label>
        </div>
      </div>
    </div>

  );
}

export default withRouter(Reservation);
