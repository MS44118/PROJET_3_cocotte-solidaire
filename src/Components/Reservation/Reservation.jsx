import axios from 'axios';
import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css/dist/js/materialize';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Input, Icon, AutoComplete } from 'antd'
import 'moment/locale/fr';
import queryString from 'query-string';
import { withRouter } from 'react-router';
import './Reservation.css';

function Reservation(
  {
    location,
  }
) {
  const [events, setEvent] = useState([]);
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [memberNumber, setMemberNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [idUser, setIdUser] = useState();
  const [quantityAdult, setQuantityAdult] = useState(1);
  const [quantityChildren, setQuantityChildren] = useState(0);
  const [allergies, setAllergies] = useState();
  const [comment, setComment] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const [labelActive, setLabelActive] = useState('');
  const [eventId, setEventId] = useState(0);
  const [existantUser, setExistantUser] = useState(false);
  const [disableInput, setDisableInput] = useState(false);
  const [registration, setRegistration] = useState(0);
  const [newReservation, setNewReservation] = useState(true);
  const [idRegistration, setIdRegistration] = useState();
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    M.AutoInit();
    axios.get('http://localhost:8000/users')
      .then((result) => {
        setUsers(result.data);
        let dataTemp = ['0 Tous les adhérents'];
        for (let i = 0; i < result.data.length; i += 1) {
          dataTemp = [...dataTemp, `${result.data[i].idUser} ${result.data[i].firstname} ${result.data[i].lastname}`];
        }
        setDataSource(dataTemp);
        console.log(dataTemp);
      });
    axios.get('http://localhost:8000/events')
      .then((result) => {
        setEvent(result.data);
        // console.log(result.data)
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
  const sendForm = () => {
    if (newReservation) {
      axios.post('http://localhost:8000/zboub/', addReservation)
        .then((response) => {
          console.log(response);
        })
        .then((err) => {
          console.log(err);
        });
    } else {
      axios.put(`http://localhost:8000/zboub/${idRegistration}`, addReservation)
        .then((response) => {
          console.log(response);
        })
        .then((err) => {
          console.log(err);
        });
      setNewReservation(!newReservation);
    }
  };

  useEffect(() => {
    if (searchValue > 0) {
      console.log(users);
      const arrayTemp = users.filter(user => user.idUser === parseInt(searchValue));
      // setUserList(arrayFilter);
      setFirstname(arrayTemp[0].firstname);
      setLastname(arrayTemp[0].lastname);
      setEmail(arrayTemp[0].email);
      setPhone(arrayTemp[0].phone);
      setMemberNumber(arrayTemp[0].member_id);
      setIdUser(arrayTemp[0].idUser);
      setMemberNumber(arrayTemp[0].memberId);
      setExistantUser(true);
      console.log(arrayTemp);
      // } else if (parseInt(searchValue) === 0) {
      //   setUserList(users);
      // }

    }
    if (searchValue.length === 0) {
      setDisableInput(false);
    } else {
      setDisableInput(true);
      setLabelActive('active');
    }
  }, [searchValue]);

  useEffect(() => {
    const params = queryString.parse(location.search);
    const registrationId = params.id;

    axios.get(`http://localhost:8000/registration/${registrationId}`)
      .then((data) => {
        setRegistration(data.data);
        console.log(data.data);
      })
      .catch((err) => {
        console.log(err);
      });

    setNewReservation(false);
  }, [location.search]);

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
      setEventId(registration[0].event_id);
      setLabelActive('active');
      setIdUser(registration[0].user_id);
      setIdRegistration(registration[0].id_registration);
    }
  }, [registration]);
  // console.log(registration)


  return (

    <div className="container">
      <h1>Réservation</h1>
      <div className="input-field col s4 mr-8">
        <button
          type="submit"
          className="waves-effect waves-light btn-small teal white-text right "
          onClick={sendForm}
        >
            Envoyer
        </button>
      </div>
      <p>oublie pas de selectionner une cativité sinon ça plante</p>
      <div className="row">
        <div className=" input-field col s4 noFuckingmargin">
          <select id="events" className="browser-default color_select" value={eventId} onChange={changeEvent => setEventId(changeEvent.target.value)}>
            <option value="0" disabled selected>Selection d&apos;un évènement</option>
            {events.map(
              (event, index) => (
                <option
                  key={(event[index])}
                  value={event.id_event}
                >
                  {event.name_event}
                  :
                  {moment(event.date_b).calendar()}
                </option>
              ),
            )}
          </select>

        </div>
        <div className=" input-field col s4 noFuckingmargin">
          <AutoComplete
            style={{ width: 300 }}
            dataSource={dataSource}
            onSelect={value => setSearchValue(value.split(' ')[0])}
            placeholder="Recherche (par nom ou prénom)"
            onResultSelect={(e, { result }) => dataSource(e, { result })}
            filterOption={(inputValue, option) => option.props.children.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().indexOf(inputValue.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase()) !== -1
            }
          >
            <Input suffix={<Icon type="search" className="certain-category-icon" />} />
          </AutoComplete>
        </div>

      </div>
      <div className=" row ">
   
        <div className="input-field col s4 noFuckingmargin">
          <p> nombres d&apos;Adultes</p>
          <select value={quantityAdult} onChange={e => setQuantityAdult(e.target.value)}>
            <option value="0" disabled selected>Nombres Adultes</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>

        </div>
        <div className="input-field col s4 ">
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

      </div>
      {/* choose event collaps bar */}
      <div className="row">

        <div className="input-field col s6 noFuckingmargin">
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
        <div className="input-field col s6">
          <i className="material-icons prefix">account_circle</i>
          <input
            type="text"
            id="firstname"
            data-length="100%"
            className="validate"
            onChange={e => setFirstname(e.target.value)}
            value={firstname}
            disabled={disableInput}
          />
          <label htmlFor="firstname" className={labelActive}>Prénom</label>
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
        <div className="input-field col s12 noFuckingmargin">
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
            type="text"
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

export default (Reservation);
