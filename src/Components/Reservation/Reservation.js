import React, { useEffect } from 'react';
import M from 'materialize-css/dist/js/materialize.js';
import 'materialize-css/dist/css/materialize.min.css';
import './Reservation.css';

function Reservation() {
  useEffect(() => {
    M.AutoInit();
  }, [])
  return (


    <div className='container'>
      <h1>Réservation</h1>
      <div className='row'>
        <div className="input-field  offset 2 col s8">
          <i className="material-icons prefix">event</i>
          <select>
            <option className="color_select" value="" disabled selected>Cuisiner et manger</option>
            <option value="1">activité 1</option>
            <option value="2">activité 2</option>
            <option value="3">activité 3</option>
          </select>

        </div>
      </div>
      <div className='row'>
        <div className="input-field col s6">
          <i className="material-icons prefix">event_busy</i>
          <input placeholder="Nom de l'évènement" id="event_name" type="text" className="validate" />
          <label for="event_name"></label>
        </div>

        <div className="input-field col s6">
          <i className="material-icons prefix">calendar_today</i>
          <input type="text" class="datepicker"></input>
        </div>

      </div>
      <div className='row'>
        <div className='col s4 txt ' >
          <p>Places à réserver</p>
        </div>
        <div class="input-field col s4">
          <select multiple>
            <option value="" disabled selected>nombre Adultes</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>


        </div>
        <div class="input-field col s4">
          <select multiple>
            <option value="" disabled selected>nombres Enfants</option>
            <option value="1">Option 1</option>
            <option value="2">Option 2</option>
            <option value="3">Option 3</option>
          </select>


        </div>

      </div>
      {/* choose event collaps bar */}
      <div className='row'>
        <div className="row">
          <div className="input-field col s6">
            <i className="material-icons prefix">account_circle</i>
            <input placeholder="Nom" id="first_name" type="text" className="validate" />
            <label for="first_name"></label>
          </div>
          <div className="input-field col s6">
            <i class="material-icons prefix">account_circle</i>
            <input placeholder="Prénom" id="last_name" type="text" className="validate" />
            <label for="last_name"></label>
          </div>
        </div>


        {/* row name mail and tel */}
        <div className="row">
          <div className="input-field col s6">
            <i className="material-icons prefix">email</i>
            <input placeholder="Email" id="email" type="email" className="validate" />
            <label for="email"></label>

          </div>
          <div className="input-field col s6">
            <i className="material-icons prefix">phone</i>
            <input placeholder="Téléphone" id="icon_telephone" type="tel" className="validate" />
            <label for="icon_telephone"></label>
          </div>
        </div>
        <div className='row'>
          <div className="input-field col s6">
            <i class="material-icons prefix">person_add</i>
            <input placeholder="Numéros d'adhérent" id="last_name" type="text" className="validate" />
            <label for="num_user"></label>
          </div>

        </div>

      </div>
      {/* alergies row */}
      <div className="row">
        <div className="input-field col s12">
          <i className="material-icons prefix">notification_important</i>
          <textarea id="icon_prefix2" class="materialize-textarea"></textarea>
          <label for="icon_prefix2">Alergies</label>
        </div>
      </div>
      {/* information Row */}
      <div className="row">
        <div className="input-field col s12">
          <i className="material-icons prefix">info</i>

          <textarea placeholder="Des choses à savoir" id="textarea2" class="materialize-textarea" data-length="100%"></textarea>

        </div>
      </div>

    </div>

  );
}

export default Reservation;