import React, { useEffect, useState } from 'react';
import M from 'materialize-css/dist/js/materialize.js';
import 'materialize-css/dist/css/materialize.min.css';
import '../Reservation/Reservation.css';

function FormMember(props) {
  const [user, setUser] = useState({});
  useEffect(() => {
    M.AutoInit();
  }, [])

  useEffect(() => {
    if (props.userSelected.user) {
      setUser({
        adress: props.userSelected.user.adress,
        birthday: props.userSelected.user.birthday,
        city: props.userSelected.user.city,
        email: props.userSelected.user.email,
        firstname: props.userSelected.user.firstname,
        gender: props.userSelected.user.gender,
        id_user: props.userSelected.user.id_user,
        image_copyright: props.userSelected.user.image_copyright,
        lastname: props.userSelected.user.lastname,
        mailing_active: props.userSelected.user.mailing_active,
        member_active: props.userSelected.user.member_active,
        member_id: props.userSelected.user.member_id,
        membership_date_last: props.userSelected.user.membership_date_last,
        membership_place: props.userSelected.user.membership_place,
        neighborhood: props.userSelected.user.neighborhood,
        phone: props.userSelected.user.phone,
        zip: props.userSelected.user.zip
      })
    }
  }, [props.userSelected.user])

  return (
    <div className='container' style={{ marginBottom: '8em' }}>
      <h1>Inscription</h1>
      <div className='row'>
        <div className="input-field  offset 2 col s8">
          <i className="material-icons prefix">wc</i>
          <select>
            <option className="color_select" value="" disabled selected>Genre</option>
            <option value="1">Feminin</option>
            <option value="2">Masculin</option>
          </select>

        </div>
      </div>
      <div className='row'>
        <div className="input-field col s6">
          <i className="material-icons prefix" >calendar_today</i>
          <input type="text" className="datepicker" placeholder="Date d'inscription"></input>
        </div>
        <div className="input-field col s6">
          <i className="material-icons prefix" >calendar_today</i>
          <input type="text" className="datepicker" placeholder="Date de naissance"></input>
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
            <i className="material-icons prefix">account_circle</i>
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

        <div className="row">
          <div className="input-field col s6">
            <i className="material-icons prefix">location_on</i>
            <input placeholder="Adresse" id="adress" type="text" className="validate" />
            <label for="first_name"></label>
          </div>
          <div className="input-field col s6">
            <i className="material-icons prefix">location_on</i>
            <input placeholder="Code postal" id="zip_code" type="text" className="validate" />
            <label for="last_name"></label>
          </div>
        </div>

        <div className='row'>
          <div className="input-field col s6">
            <i className="material-icons prefix">location_on</i>
            <input placeholder="Ville" id="city" type="text" className="validate" />
            <label for="num_user"></label>
          </div>
          <div className="input-field col s6">
            <label>
              <input type="checkbox" />
              <span>Habite dans le quartier</span>
            </label>
          </div>
        </div>

        <div className='row'>
          <div className="input-field col s6">
            <i className="material-icons prefix">person_add</i>
            <input placeholder="Numéros d'adhérent" id="last_name" type="text" className="validate" />
            <label for="num_user"></label>
          </div>
          <div className="input-field col s6">
            <label>
              <input type="checkbox" />
              <span>Membre actif</span>
            </label>
          </div>
        </div>

        <div className='row'>
          <div className="input-field col s4">
            <label>
              <input type="checkbox" />
              <span>Droit à l'image</span>
            </label>
          </div>
          <div className="input-field col s4">
            <label>
              <input type="checkbox" />
              <span>Accepte l'envoie de mail</span>
            </label>
          </div>
          <div className="input-field col s4">
            <button
              className="waves-effect waves-light btn-small teal white-text right col s4"
              onClick={''}>Envoyer</button>
          </div>

        </div>

      </div>
    </div>

  );
}

export default FormMember;
