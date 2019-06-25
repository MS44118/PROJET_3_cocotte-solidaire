import axios from 'axios';
import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css/dist/js/materialize';
import React, { useEffect, useState } from 'react';
import { Search } from 'semantic-ui-react';
import 'semantic-ui/dist/semantic.min.css';
import  moment from 'moment';
import './Reservation.css';

moment.locale('fr', {
  months : 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
  monthsShort : 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
  monthsParseExact : true,
  weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
  weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
  weekdaysMin : 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
  weekdaysParseExact : true,
  longDateFormat : {
      LT : 'HH:mm',
      LTS : 'HH:mm:ss',
      L : 'DD/MM/YYYY',
      LL : 'D MMMM YYYY',
      LLL : 'D MMMM YYYY HH:mm',
      LLLL : 'dddd D MMMM YYYY HH:mm'
  },
  calendar : {
      sameDay : '[Aujourd’hui à] LT',
      nextDay : '[Demain à] LT',
      nextWeek : 'dddd [à] LT',
      lastDay : '[Hier à] LT',
      lastWeek : 'dddd [dernier à] LT',
      sameElse : 'L'
  },
  relativeTime : {
      future : 'dans %s',
      past : 'il y a %s',
      s : 'quelques secondes',
      m : 'une minute',
      mm : '%d minutes',
      h : 'une heure',
      hh : '%d heures',
      d : 'un jour',
      dd : '%d jours',
      M : 'un mois',
      MM : '%d mois',
      y : 'un an',
      yy : '%d ans'
  },
  dayOfMonthOrdinalParse : /\d{1,2}(er|e)/,
  ordinal : function (number) {
      return number + (number === 1 && 'er' );
  },
  meridiemParse : /PD|MD/,
  isPM : function (input) {
      return input.charAt(0) === 'M';
  },
  // In case the meridiem units are not separated around 12, then implement
  // this function (look at locale/id.js for an example).
  // meridiemHour : function (hour, meridiem) {
  //     return /* 0-23 hour, given meridiem token and hour 1-12 */ ;
  // },
  meridiem : function (hours, minutes, isLower) {
      return hours < 12 ? 'PD' : 'MD';
  },
  week : {
      dow : 1, // Monday is the first day of the week.
      doy : 4  // Used to determine first week of the year.
  }
});

function Reservation() {

  const [event, setEvent] = useState([]);
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const [firstname, setFirstname] = useState(['']);
  const [lastname, setLastname] = useState('');
  const [memberId, setMemberId] = useState('');
  const [phone, setPhone] = useState('');
  const [idUser, setIdUser] = useState('');
  const [numberAdultReservation, setnumberAdultReservation] = useState(0);
  const [numberchildrenReservation, setnumbeChildrenRegistration] = useState(0);
  const [reservationAllergie, setReservationAllergie] = useState('');
  const [reservationInfo, setReservationInfo] = useState('');
  const [eventReservation, setEventReservation] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([{ title: '' }]);
  const [labelActive, setLabelActive] = useState('');
  // const[dateEvent, setDateEvent]  = useState('')
  const [existantUser, setExistantUser] = useState(false);

  useEffect(() => {
    M.AutoInit();

    axios.get('http://localhost:8000/users')
      .then((result) => {
        setUsers(result.data);
      }); 
    axios.get('http://localhost:8000/events')
      .then((result) => {
      
        setEvent(  result.data );
   
       
      });
  },
  []);

  const numberReservation = (numberAdultReservation/1+ (numberchildrenReservation/2));
  
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
      for (let i = 0; i < arrayTemp.length; i++) {
        resultTemp = [...resultTemp, { title: `${arrayTemp[i].lastname} ${arrayTemp[i].firstname}`, description: arrayTemp[i].id_user }];
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
      <p>place disponibles :{event.capacity}</p>
         </div>
        <div className="input-field col s6">
        <select id="event" className="browser-default color_select" value= {eventReservation} onChange={event => {setEventReservation(event.target.value)}}>
            {event.map((event, index) =>
              <option key={event[index]} value={event.name_event}>{event.name_event} : {moment(event.date_b).calendar()}</option>
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
            value=""
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
            onChange={e => setIdUser(e.target.value)}
            value={idUser}
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
}

export default Reservation;
