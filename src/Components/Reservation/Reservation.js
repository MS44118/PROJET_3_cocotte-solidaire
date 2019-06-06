import React ,{useEffect} from 'react';
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
        <div className="input-field  col s8">
        <i className="material-icons prefix">event</i>
    <select id="activity">
      <option  className ="color_select"value="" disabled selected>Cuisiner et manger</option>
      <option value="1">activité 1</option>
      <option value="2">activité 2</option>
      <option value="3">activité 3</option>
   
    </select>
  
  </div>
  <div className="input-field col s4 mr-8">
           <button
             className="waves-effect waves-light btn-small teal white-text right "
             onClick={''}>Envoyer</button>
         </div>
  </div>
  <div className='row'>
  <div className="input-field col s6">
            <i className="material-icons prefix">event_busy</i>
            <input  id="event_name" type="text" className="validate" />
            <label for="event_name">Nom de l'évènement</label>
        </div>

    <div className="input-field col s6">
    <i className="material-icons prefix">calendar_today</i>
    <input type="text" class="datepicker"></input>
    </div>

  </div>
  <div className='row'>
    <div className= 'col s4 txt ' >
      <p>Places à réserver</p>
    </div>
    <div className="input-field col s4">
    <select multiple>
      <option value="" disabled selected>Nombre Adultes</option>
      <option value="adult_1">1</option>
      <option value="adult_2">2</option>
      <option value="adult_3">3</option>
      <option value="adult_4">4</option>
      <option value="adult_5">5</option>
      <option value="adult_6">6</option>
    </select>
    
    
  </div>
  <div className="input-field col s4">
    <select multiple>
      <option value="" disabled selected>Nombres Enfants</option>
      <option value="child_1">1</option>
      <option value="child_2">2</option>
      <option value="child_3">3</option>
      <option value="child_4">4</option>
      <option value="child_5">5</option>
      <option value="child_6">6</option>
    </select>
  
  
  </div>

  </div>
      {/* choose event collaps bar */}
      <div className='row'>
        <div className="row">
          <div className="input-field col s6">
            <i className="material-icons prefix">account_circle</i>
            <input  id="first_name" type="text" className="validate" />
            <label for="first_name">Nom</label>
          </div>
          <div className="input-field col s6">
            <i className="material-icons prefix">account_circle</i>
            <input     id="last_name" type="text" className="validate" />
            <label for="last_name">Prénom</label>
          </div>
        </div>


        {/* row name mail and tel */}
        <div className="row">
          <div className="input-field col s6">
            <i className="material-icons prefix">email</i>
            <input  id="email" type="email" className="validate" />
            <label for="email">Email</label>

          </div>
          <div className="input-field col s6">
            <i className="material-icons prefix">phone</i>
            <input  id="icon_telephone" type="tel" className="validate" />
            <label for="icon_telephone">Téléphone</label>
          </div>
        </div>
        <div className='row'>
        <div className="input-field col s6">
            <i className="material-icons prefix">person_add</i>
            <input  id="num_user" type="text" className="validate" />
            <label for="num_user">Numéros d'adhérent</label>
          </div>

        </div>

      </div>
      {/* alergies row */}
      <div className="row">
        <div className="input-field col s12">
          <i className="material-icons prefix">notification_important</i>
          <textarea id="allergy" className="materialize-textarea"></textarea>
          <label for="allergy">Allergies</label>
        </div>
      </div>
      {/* information Row */}
      <div className="row">
        <div className="input-field col s12">
          <i className="material-icons prefix">info</i>

          <textarea id="importantInfo" className="materialize-textarea" data-length="100%"></textarea>
          <label for="importantInfo">Informations complémentaires</label> 
        </div>
      </div>

    </div>

  );
}

export default Reservation;