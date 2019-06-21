import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import DatePicker, { registerLocale } from 'react-datepicker';
import M from 'materialize-css/dist/js/materialize';
import 'materialize-css/dist/css/materialize.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import '../Reservation/Reservation.css';
import fr from 'date-fns/locale/fr';
import './FormMember.css';
import { displayNewUserFormAction, displayKnownUserFormAction } from '../../Actions/displayUserFormAction';
import { updateUserAction, newUserAction } from '../../Actions/userAction';

registerLocale('fr', fr);

function FormMember({ userSelected, dispatch }) {
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
  const [idUser, setIdUser] = useState('');
  const [labelActive, setLabelActive] = useState('');

  useEffect(() => {
    M.AutoInit();
  }, []);

  useEffect(() => {
    if (userSelected.user) {
      setIdUser(userSelected.user.idUser);
      setAdress(userSelected.user.adress);
      setBirthday(userSelected.user.birthday !== 'Invalid date' ? userSelected.user.birthday : '');
      setCity(userSelected.user.city);
      setEmail(userSelected.user.email);
      setFirstname(userSelected.user.firstname);
      setGender(userSelected.user.gender);
      setImageCopyright(userSelected.user.imageCopyright);
      setLastname(userSelected.user.lastname);
      setMailingActive(userSelected.user.mailingActive);
      setMemberActive(userSelected.user.memberActive);
      setMemberId(userSelected.user.memberId);
      setMembershipDateLast(userSelected.user.membershipDateLast !== 'Invalid date' ? userSelected.user.membershipDateLast : '');
      setMembershipPlace(userSelected.user.membershipPlace);
      setNeighborhood(userSelected.user.neighborhood);
      setPhone(userSelected.user.phone);
      setZip(userSelected.user.zip);
      setLabelActive('active');
    }
  }, [userSelected]);

  useEffect(() => {
    const userTemp = {
      idUser,
      adress,
      birthday,
      city,
      email,
      firstname,
      gender,
      imageCopyright,
      lastname,
      mailingActive,
      memberActive,
      memberId,
      membershipDateLast,
      membershipPlace,
      neighborhood,
      phone,
      zip,
    };
    setUser(userTemp);
  }, [adress, birthday, city, email, firstname, gender, imageCopyright,
    lastname, mailingActive, memberActive, memberId, membershipDateLast,
    membershipPlace, neighborhood, phone, zip]);

  const handleSend = () => {
    if (userSelected === 'new') {
      dispatch(displayNewUserFormAction('none'));
    } else {
      dispatch(displayKnownUserFormAction('none'));
    }
    if (idUser) {
      dispatch(updateUserAction(user));
      axios.put(`http://localhost:8000/user/${idUser}`, user)
        .then((res) => {
          console.log(res.statusText);
          if (res.status === 200) {
            dispatch(updateUserAction(user));
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      axios.post('http://localhost:8000/user/', user)
        .then((data) => {
          const userTemp = { ...user, idUser: data.data[0].id_user };
          dispatch(newUserAction(userTemp));
        })
        .catch((error) => {
          console.log(error);
        });
    }
    setIdUser('');
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
  };

  const handleClose = () => {
    if (userSelected === 'new') {
      dispatch(displayNewUserFormAction('none'));
    } else {
      dispatch(displayKnownUserFormAction('none'));
    }
  };

  return (
    <div className="container" style={{ marginBottom: '8em' }}>
      <h1>Inscription</h1>
      <div className="row">
        <div className="input-field col s3">
          <select value={gender} onChange={event => setGender(event.target.value)}>
            <option className="color_select" value="" disabled selected>Genre</option>
            <option value="female">Feminin</option>
            <option value="male">Masculin</option>
          </select>
        </div>
        <div className="input-field col">
          <span style={{ color: 'black', fontSize: '1.2em' }}>Date d&apos;adhésion :</span>
          <i className="material-icons">calendar_today</i>
          <DatePicker
            locale="fr"
            dateFormat="dd/MM/yyyy"
            selected={membershipDateLast ? new Date(membershipDateLast) : new Date()}
            onChange={date => date && setMembershipDateLast(date)}
          />
        </div>
        <div className="input-field col">
          <span style={{ color: 'black', fontSize: '1.2em' }}>Date de naissance :</span>
          <i className="material-icons">calendar_today</i>
          <DatePicker
            locale="fr"
            dateFormat="dd/MM/yyyy"
            selected={birthday && new Date(birthday)}
            onChange={date => date && setBirthday(date)}
          />
        </div>
      </div>
        <div className="row">
          <div className="input-field col s6">
            <i className="material-icons prefix">account_circle</i>
            <input
              id="last_name"
              value={lastname !== null ? lastname : ''}
              onChange={event => setLastname(event.target.value)}
              type="text"
              className="validate"
            />
            <label className={labelActive} htmlFor="last_name">
              Nom
            </label>
          </div>
          <div className="input-field col s6">
            <i className="material-icons prefix">account_circle</i>
            <input
              id="first_name"
              value={firstname !== null ? firstname : ''}
              onChange={event => setFirstname(event.target.value)}
              type="text"
              className="validate"
            />
            <label className={labelActive} htmlFor="first_name">
              Prénom
            </label>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s6">
            <i className="material-icons prefix">email</i>
            <input
              value={email !== null ? email : ''}
              onChange={event => setEmail(event.target.value)}
              id="email"
              type="email"
              className="validate"
            />
            <label className={labelActive} htmlFor="email">
              Email
            </label>
          </div>
          <div className="input-field col s6">
            <i className="material-icons prefix">phone</i>
            <input
              value={phone !== null ? phone : ''}
              onChange={event => setPhone(event.target.value)}
              id="icon_telephone"
              type="tel"
              className="validate"
            />
            <label className={labelActive} htmlFor="icon_telephone">
              Téléphone
            </label>
          </div>
        </div>

        <div className="row">
          <div className="input-field col s6">
            <i className="material-icons prefix">location_on</i>
            <input
              value={adress !== null ? adress : ''}
              onChange={event => setAdress(event.target.value)}
              id="adress"
              type="text"
              className="validate"
            />
            <label className={labelActive} htmlFor="adress">
              Adresse
            </label>
          </div>
          <div className="input-field col s6">
            <i className="material-icons prefix">location_on</i>
            <input
              value={zip !== null ? zip : ''}
              onChange={event => setZip(event.target.value)}
              id="zip_code"
              type="text"
              className="validate"
            />
            <label className={labelActive} htmlFor="zip_code">
              Code postal
            </label>
          </div>
        </div>

        <div className="row">
          <div className="input-field col s6">
            <i className="material-icons prefix">location_on</i>
            <input
              value={city && city}
              onChange={event => setCity(event.target.value)}
              id="city"
              type="text"
              className="validate"
            />
            <label className={labelActive} htmlFor="city">
              Ville
            </label>
          </div>
          <div className="input-field col s6">
            <label>
              <input
                type="checkbox"
                id="check_neighborhood"
                checked={neighborhood ? 'checked' : ''}
                onChange={event => setNeighborhood(event.target.checked)}
              />
              <span>Habite dans le quartier</span>
            </label>
          </div>
        </div>

        <div className="row">
          <div className="input-field col s6">
            <i className="material-icons prefix">person_add</i>
            <input
              value={memberId && memberId}
              onChange={event => setMemberId(event.target.value)}
              id="member_id"
              type="text"
              className="validate"
            />
            <label className={labelActive} htmlFor="member_id">
              Numéro d&apos;adhérent
            </label>
          </div>
          <div className="input-field col s6">
            <label>
              <input
                type="checkbox"
                id="check_member_active"
                checked={memberActive ? 'checked' : ''}
                onChange={event => setMemberActive(event.target.checked)}
              />
              <span>Membre actif</span>
            </label>
          </div>
        </div>

        <div className="row">
          <div className="input-field col s3">
            <label>
              <input
                type="checkbox"
                id="check_image_copyright"
                checked={imageCopyright ? 'checked' : ''}
                onChange={event => setImageCopyright(event.target.checked)}
              />
              <span>Droit à l&apos;image</span>
            </label>
          </div>
          <div className="input-field col s3">
            <label>
              <input
                type="checkbox"
                id="check_mailing_active"
                checked={mailingActive ? 'checked' : ''}
                onChange={event => setMailingActive(event.target.checked)}
              />
              <span>Accepte l&apos;envoie de mail</span>
            </label>
          </div>
          <div className="input-field col s3">
            <button
              type="button"
              className="waves-effect waves-light btn-small teal darken-1 white-text right col s4"
              onClick={handleSend}
            >
              Envoyer
            </button>
          </div>
          <div className="input-field col s3">
            <button
              type="button"
              className="waves-effect waves-light btn-small teal darken-1 white-text right col s4"
              onClick={handleClose}
            >
              Fermer
            </button>
          </div>
        </div>
    </div>
  );
}

FormMember.propTypes = {
  userSelected: PropTypes.shape({
    adress: PropTypes.string,
    birthday: PropTypes.string,
    city: PropTypes.string,
    email: PropTypes.string,
    firstname: PropTypes.string,
    gender: PropTypes.string,
    imageCopyright: PropTypes.bool,
    lastname: PropTypes.string,
    mailingActive: PropTypes.bool,
    memberActive: PropTypes.bool,
    memberId: PropTypes.string,
    membershipDateLast: PropTypes.string,
    membershipPlace: PropTypes.string,
    neighborhood: PropTypes.bool,
    phone: PropTypes.string,
    zip: PropTypes.string,
  }),
  dispatch: PropTypes.func,
};

FormMember.defaultProps = {
  userSelected: null,
  dispatch: null,
};

export default connect()(FormMember);
