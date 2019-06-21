import axios from 'axios';
import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css/dist/js/materialize';
import React, { useEffect, useState } from 'react';
import { Search } from 'semantic-ui-react';
import 'semantic-ui/dist/semantic.min.css';
import './Reservation.css';


function Reservation() {

  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [memberId, setMemberId] = useState('');
  const [phone, setPhone] = useState('');
  const [idUser, setIdUser] = useState('');
  const [numberAdultReservation, setnumberAdultReservation] = useState(1);
  const [numberchildrenReservation, setnumbeChildrenRegistration] = useState(0);
  const [reservationAllergie, setReservationAllergie] = useState('');
  const [reservationInfo, setReservationInfo] = useState('');
  const [newActivities, setNewActivities] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([{ title: '' }]);
  const [labelActive, setLabelActive] = useState('');
  const [existantUser, setExistantUser] = useState(false);
  

  useEffect(() => {
    M.AutoInit();

    axios.get('http://localhost:8000/users')
      .then((result) => {
        setUsers(result.data);
      });
    axios.get('http://localhost:8000/activities')
      .then((result) => {
        setActivities(result.data);
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
  };

  const sendForm = () => {
    axios.post('http://localhost:8000/zboub/', addReservation)
      .then(function (response) {
        console.log(response)})
      .then(function (err) {
        console.log(err)})  
  };

  useEffect(() => {
    if (searchValue.length > 0) {
      const arrayTemp = users.filter(user => user.lastname.toLowerCase().includes(`${searchValue.toLowerCase()}`));

      let resultTemp = [];
      for (let i = 0; i < arrayTemp.length; i++) {
        resultTemp = [...resultTemp, { title: arrayTemp[i].lastname, description: arrayTemp[i].id_user }];
      }
      setSearchResults(resultTemp);
   
    }
  }, [searchValue]);

  const handleUser = (e, { result })=> {
    const arrayTemp = users.filter(user => user.idUser  === result.description);
    
    setFirstname(arrayTemp[0].firstname);
    setLastname(arrayTemp[0].lastname);
    setEmail(arrayTemp[0].email);
    setPhone(arrayTemp[0].phone);
    setIdUser(arrayTemp[0].member_id);
    setLabelActive('active');
    setExistantUser(true);

  };
console.log(activities.filter(activity => activity.name_activity))
  const handleReservation = (index, ) => 
  {
    setNewActivities(activities[index].name);
    setLabelActive('active') ;        
  };

  return (

    <div className="container">
      <h1>Réservation</h1>
      <div className="row">
        <div className="input-field  col s8">

          <select id="activity" className="browser-default color_select" onChange={event => handleReservation(event.target.value)}>
            {activities.map((activity, index) =>
              <option value={index}>{activity.name}</option>
            )};
           </select>


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
          <i className="material-icons prefix">event_busy</i>
          <input id="event_name" type="text" className="validate" value={newActivities} onChange={e => setNewActivities(e.target.value)} />
          <label  id="event_name"htmlFor="event_name" className={labelActive} >Nom de l&apos;évènement</label>
        </div>

        <div className="input-field col s6">
          <i className="material-icons prefix">calendar_today</i>
          <input type="text" className="datepicker" />
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
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>

        </div>
        <div className="input-field col s4">
          <p>Nombres d&apo;senfants</p>
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
          onResultSelect={handleUser}
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
              className="validate"
              onChange={e => setFirstname(e.target.value)}
              value={firstname} 
            />
            <label htmlFor="firstname"className={labelActive} >Prénom</label>
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
          />
          <label htmlFor="email"className={labelActive} >
            Email
            </label>
        </div>

        <div className="input-field col s6">
          <i className="material-icons prefix">phone</i>
          <input
            id="icon_telephone"
            type="tel" className="validate"
            onChange={e => setPhone(e.target.value)}
            value={phone}
          />
          <label htmlFor="icon_telephone"className={labelActive} >
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
            onChange={e => setIdUser(e.target.value)}
            value={idUser} 
          />
          <label htmlFor="num_user"className={labelActive} >
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
