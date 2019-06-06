import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
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
  const [imageCopyright, setImageCopyright] = useState('');
  const [lastname, setLastname] = useState('');
  const [mailingActive, setMailingActive] = useState('');
  const [memberActive, setMemberActive] = useState('');
  const [memberId, setMemberId] = useState('');
  const [membershipDateLast, setMembershipDateLast] = useState('');
  const [membershipPlace, setMembershipPlace] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [phone, setPhone] = useState('');
  const [zip, setZip] = useState('');
  const [labelActive, setLabelActive] = useState('')
  
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
      setLabelActive('active')
    } else {
      setUser({
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
        member_id: '',
        membership_date_last: membershipDateLast,
        membership_place: membershipPlace,
        neighborhood: neighborhood,
        phone: phone,
        zip: zip
      })
    }
  }, [props.userSelected])

  const handleSend = () =>{
    if(props.userSelected === 'new'){
      props.dispatch(displayNewUserFormAction('none'));
    } else {
      props.dispatch(displayKnownUserFormAction('none'))
    }
    setUser({
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
    })
    console.log(user)
  } 

  return (
    <div className='container' style={{ marginBottom: '8em' }}>
      <h1>Inscription</h1>
      <div className='row'>
        <div className="input-field  offset 2 col s8">
          <i className="material-icons prefix">wc</i>
          <select value={user.gender} onChange={(event)=> setGender(event.target.value)}>
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
            <input id="last_name" value={user.lastname ? user.lastname : null} onChange={(event)=> {setUser({...user, lastname:'' }); setLastname(event.target.value)}} type="text" className="validate" />
            <label className={labelActive} for="last_name">Nom</label>
          </div>
          <div className="input-field col s6">
            <i className="material-icons prefix">account_circle</i>
            <input id="first_name" value={user.firstname ? user.firstname : null} onChange={(event)=> {setUser({...user, firstname:'' }); setFirstname(event.target.value)}} type="text" className="validate" />
            <label className={labelActive} for="first_name">Prénom</label>
          </div>
        </div>

{/* label, si recup user , className active */}

        {/* row name mail and tel */}
        <div className="row">
          <div className="input-field col s6">
            <i className="material-icons prefix">email</i>
            <input value={user.email ? user.email : null} onChange={(event)=> {setUser({...user, email:'' }); setEmail(event.target.value)}} id="email" type="email" className="validate" />
            <label className={labelActive} for="email">Email</label>

          </div>
          <div className="input-field col s6">
            <i className="material-icons prefix">phone</i>
            <input value={user.phone ? user.phone : null} onChange={(event)=> {setUser({...user, phone:'' }); setPhone(event.target.value)}} id="icon_telephone" type="tel" className="validate" />
            <label className={labelActive} for="icon_telephone">Téléphone</label>
          </div>
        </div>

        <div className="row">
          <div className="input-field col s6">
            <i className="material-icons prefix">location_on</i>
            <input value={user.adress ? user.adress : null} onChange={(event)=> {setUser({...user, adress:'' }); setAdress(event.target.value)}} id="adress" type="text" className="validate" />
            <label className={labelActive} for="adress">Adress</label>
          </div>
          <div className="input-field col s6">
            <i className="material-icons prefix">location_on</i>
            <input value={user.zip ? user.zip : null} onChange={(event)=> {setUser({...user, zip:'' }); setZip(event.target.value)}} id="zip_code" type="text" className="validate" />
            <label className={labelActive} for="zip_code">Code postal</label>
          </div>
        </div>

        <div className='row'>
          <div className="input-field col s6">
            <i className="material-icons prefix">location_on</i>
            <input value={user.city ? user.city : null} onChange={(event)=> {setUser({...user, city:'' }); setCity(event.target.value)}} id="city" type="text" className="validate" />
            <label className={labelActive} for="city">Ville</label>
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
            <input value={user.member_id ? user.member_id : null} onChange={(event)=> {setUser({...user, member_id:'' }); setMemberId(event.target.value)}} id="member_id" type="text" className="validate" />
            <label className={labelActive} for="member_id">Numéro d'adhérent</label>
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
              onClick={handleSend}>Envoyer</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default connect()(FormMember)