import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import M from 'materialize-css/dist/js/materialize.js';
import 'materialize-css/dist/css/materialize.min.css';
import '../Reservation/Reservation.css';

//ACTIONS 
import { displayNewUserFormAction, displayKnownUserFormAction } from '../../Actions/displayUserFormAction';

function FormMember(props) {
  const [user, setUser] = useState({});
  const [adress, setAdress] = useState('');
  const [birthday, setBirthday] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');
  const [firstname, setFirstname] = useState('');
  const [gender, setGender] = useState('');
  const [imageCopyright, setImageCopyright] = useState(false);
  const [lastname, setLastname] = useState('');
  const [mailingActive, setMailingActive] = useState(false);
  const [memberActive, setMemberActive] = useState(false);
  const [memberId, setMemberId] = useState('');
  const [membershipDateLast, setMembershipDateLast] = useState('');
  const [membershipPlace, setMembershipPlace] = useState('');
  const [neighborhood, setNeighborhood] = useState(false);
  const [phone, setPhone] = useState('');
  const [zip, setZip] = useState('');

  const [labelActive, setLabelActive] = useState('')

  useEffect(() => {
    M.AutoInit();
  }, [])

  useEffect(() => {
    if (props.userSelected.user) {
      setAdress(props.userSelected.user.adress);
      setBirthday(props.userSelected.user.birthday);
      setCity(props.userSelected.user.city);
      setEmail(props.userSelected.user.email);
      setFirstname(props.userSelected.user.firstname);
      setGender(props.userSelected.user.gender);
      setImageCopyright(props.userSelected.user.image_copyright);
      setLastname(props.userSelected.user.lastname);
      setMailingActive(props.userSelected.user.mailing_active);
      setMemberActive(props.userSelected.user.member_active);
      setMemberId(props.userSelected.user.member_id);
      setMembershipDateLast(props.userSelected.user.membership_date_last);
      setMembershipPlace(props.userSelected.user.membership_place);
      setNeighborhood(props.userSelected.user.neighborhood);
      setPhone(props.userSelected.user.phone);
      setZip(props.userSelected.user.zip);
      setLabelActive('active')
    }
  }, [props.userSelected])

  useEffect(() => {
    let userTemp  = {
      adress: adress,
      birthday: birthday,
      city: city,
      email: email,
      firstname: firstname,
      gender: gender,
      image_copyright: imageCopyright,
      lastname: lastname,
      mailing_active: mailingActive,
      member_active: memberActive,
      member_id: memberId,
      membership_date_last: membershipDateLast,
      membership_place: membershipPlace,
      neighborhood: neighborhood,
      phone: phone,
      zip: zip
    }
    setUser(userTemp);

  }, [adress, birthday, city, email, firstname, gender, imageCopyright, lastname, mailingActive, memberActive, memberId, membershipDateLast, membershipPlace, neighborhood, phone, zip])

  const handleSend = () => {
    if (props.userSelected === 'new') {
      props.dispatch(displayNewUserFormAction('none'));
    } else {
      props.dispatch(displayKnownUserFormAction('none'))
    }
    setAdress('');
    setBirthday('');
    setCity('');
    setEmail('');
    setFirstname('');
    setGender('');
    setImageCopyright(false);
    setLastname('');
    setMailingActive(false);
    setMemberActive(false);
    setMemberId('');
    setMembershipDateLast('');
    setMembershipPlace('');
    setNeighborhood(false);
    setPhone('');
    setZip('');
  }

  return (
    <div className='container' style={{ marginBottom: '8em' }}>
      <h1>Inscription</h1>
      <div className='row'>
        <div className="input-field  offset 2 col s8">
          <i className="material-icons prefix">wc</i>
          <select value={user.gender} onChange={(event) => setGender(event.target.value)}>
            <option className="color_select" value="" disabled >Genre</option>
            <option value="female">Feminin</option>
            <option value="male">Masculin</option>
          </select>

        </div>
      </div>
      <div className='row'>
        <div className="input-field col s6">
          <i className="material-icons prefix" >calendar_today</i>
          <input type="text"
            value={membershipDateLast && moment(membershipDateLast).format('L')}
            onChange={(event) => setBirthday(event.target.value)}
            className="datepicker"
            placeholder="Date d'inscription"></input>
        </div>
        <div className="input-field col s6">
          <i className="material-icons prefix" >calendar_today</i>
          <input type="text"
            value={birthday && moment(birthday).format('L')}
            onChange={(event) => setMembershipDateLast(event.target.value)}
            className="datepicker"
            placeholder="Date de naissance"></input>
        </div>
      </div>
      {/* choose event collaps bar */}
      <div className='row'>
        <div className="row">
          <div className="input-field col s6">
            <i className="material-icons prefix">account_circle</i>
            <input id="last_name"
              value={lastname && lastname}
              onChange={(event) => setLastname(event.target.value)}
              type="text"
              className="validate" />
            <label className={labelActive} htmlFor="last_name">Nom</label>
          </div>
          <div className="input-field col s6">
            <i className="material-icons prefix">account_circle</i>
            <input id="first_name"
              value={firstname && firstname}
              onChange={(event) => setFirstname(event.target.value)}
              type="text"
              className="validate" />
            <label className={labelActive} htmlFor="first_name">Prénom</label>
          </div>
        </div>

        {/* label, si recup user , className active */}

        {/* row name mail and tel */}
        <div className="row">
          <div className="input-field col s6">
            <i className="material-icons prefix">email</i>
            <input value={email && email}
              onChange={(event) => setEmail(event.target.value)}
              id="email"
              type="email"
              className="validate" />
            <label className={labelActive} htmlFor="email">Email</label>

          </div>
          <div className="input-field col s6">
            <i className="material-icons prefix">phone</i>
            <input value={phone && phone}
              onChange={(event) => setPhone(event.target.value)}
              id="icon_telephone"
              type="tel"
              className="validate" />
            <label className={labelActive} htmlFor="icon_telephone">Téléphone</label>
          </div>
        </div>

        <div className="row">
          <div className="input-field col s6">
            <i className="material-icons prefix">location_on</i>
            <input value={adress && adress}
              onChange={(event) => setAdress(event.target.value)}
              id="adress"
              type="text"
              className="validate" />
            <label className={labelActive} htmlFor="adress">Adress</label>
          </div>
          <div className="input-field col s6">
            <i className="material-icons prefix">location_on</i>
            <input value={zip && zip}
              onChange={(event) => setZip(event.target.value)}
              id="zip_code"
              type="text"
              className="validate" />
            <label className={labelActive} htmlFor="zip_code">Code postal</label>
          </div>
        </div>

        <div className='row'>
          <div className="input-field col s6">
            <i className="material-icons prefix">location_on</i>
            <input value={city && city}
              onChange={(event) => setCity(event.target.value)}
              id="city"
              type="text"
              className="validate" />
            <label className={labelActive} htmlFor="city">Ville</label>
          </div>
          <div className="input-field col s6">
            <label >
              <input type="checkbox"
                id="check_neighborhood"
                checked={neighborhood ? "checked": ""}
                onChange={(event) => setNeighborhood(event.target.checked)} />
              <span>Habite dans le quartier</span>
            </label>
          </div>
        </div>

        <div className='row'>
          <div className="input-field col s6">
            <i className="material-icons prefix">person_add</i>
            <input value={memberId && memberId}
              onChange={(event) => setMemberId(event.target.value)}
              id="member_id"
              type="text"
              className="validate" />
            <label className={labelActive} htmlFor="member_id">Numéro d'adhérent</label>
          </div>
          <div className="input-field col s6">
            <label >
              <input type="checkbox"
                id="check_member_active"
                checked={memberActive  ? "checked" : ""}
                onChange={(event) => setMemberActive(event.target.checked)} />
              <span>Membre actif</span>
            </label>
          </div>
        </div>

        <div className='row'>
          <div className="input-field col s4">
            <label >
              <input type="checkbox"
                id="check_image_copyright"
                checked={imageCopyright  ? "checked" : ""}
                onChange={(event) => setImageCopyright(event.target.checked)} />
              <span>Droit à l'image</span>
            </label>
          </div>
          <div className="input-field col s4">
            <label >
              <input type="checkbox"
                id="check_mailing_active"
                checked={mailingActive ? "checked" : ''}
                onChange={(event) => setMailingActive(event.target.checked)} />
              <span>Accepte l'envoie de mail</span>
            </label>
          </div>
          <div className="input-field col s4">
            <button
              className="waves-effect waves-light btn-small teal darken-1 white-text right col s4"
              onClick={handleSend}>Envoyer</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default connect()(FormMember)