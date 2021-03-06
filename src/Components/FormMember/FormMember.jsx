import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import DatePicker, { registerLocale } from 'react-datepicker';
import {
  Select, message, Row, Col,
} from 'antd';
import fr from 'date-fns/locale/fr';
import 'react-datepicker/dist/react-datepicker.css';
import '../Reservation/Reservation.css';
import './FormMember.css';
import conf from '../../app.conf';
import setHeaderToken from '../../Utils/tokenUtil';

import { displayNewUserFormAction, displayKnownUserFormAction } from '../../Actions/displayUserFormAction';
import { updateUserAction, newUserAction } from '../../Actions/userAction';

registerLocale('fr', fr);

function FormMember({ userSelected, dispatch }) {
  const { Option } = Select;
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
  const [membershipDateLast, setMembershipDateLast] = useState(new Date());
  const [membershipPlace, setMembershipPlace] = useState('');
  const [neighborhood, setNeighborhood] = useState(false);
  const [phone, setPhone] = useState('');
  const [zip, setZip] = useState('');
  const [idUser, setIdUser] = useState('');
  const [labelActive, setLabelActive] = useState('');

  useEffect(() => {
    if (userSelected.user) {
      axios.get(`${conf.url}/api/user/${userSelected.user.idUser}`)
        .then((data) => {
          setUser(data.data[0]);
        })
        .catch(() => {
          message.error("Problème lors de la récupération de l'utilisateur.", 3);
        });
    }
  }, [userSelected]);

  useEffect(() => {
    if (user.idUser) {
      setIdUser(user.idUser);
      setAdress(user.adress);
      setBirthday(user.birthday !== 'Invalid date' ? user.birthday : '');
      setCity(user.city);
      setEmail(user.email);
      setFirstname(user.firstname);
      setGender(user.gender);
      setImageCopyright(user.imageCopyright);
      setLastname(user.lastname);
      setMailingActive(user.mailingActive);
      setMemberActive(user.memberActive);
      setMemberId(user.memberId);
      setMembershipDateLast(user.membershipDateLast !== 'Invalid date' ? user.membershipDateLast : '');
      setMembershipPlace(user.membershipPlace);
      setNeighborhood(user.neighborhood);
      setPhone(user.phone);
      setZip(user.zip);
      setLabelActive('active');
    }
  }, [user]);

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
    if (userSelected.type === 'new') {
      dispatch(displayNewUserFormAction('none'));
    } else {
      dispatch(displayKnownUserFormAction('none'));
    }
    if (idUser) {
      dispatch(updateUserAction(user));
      setHeaderToken(() => {
        axios.put(`${conf.url}/api/user/${idUser}`, user)
          .then((res) => {
            if (res.status === 200) {
              dispatch(updateUserAction(user));
              message.success('La modification a bien été prise en compte', 3);
            }
          })
          .catch(() => {
            message.error("Une erreur s'est produite. Merci de réessayer", 3);
          });
      });
    } else {
      setHeaderToken(() => {
        axios.post(`${conf.url}/api/user/`, user)
          .then((data) => {
            if (data) {
              const userTemp = { ...user, idUser: data.data[0].id_user };
              dispatch(newUserAction(userTemp));
              message.success("L'enregistrement a bien été pris en compte", 3);
            }
          })
          .catch(() => {
            message.error("Une erreur s'est produite. Merci de réessayer", 3);
          });
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
    if (userSelected.type === 'new') {
      dispatch(displayNewUserFormAction('none'));
    } else {
      dispatch(displayKnownUserFormAction('none'));
    }
  };

  return (
    <div className="container form">
      <Row>
        <Col sm={24} md={8} className="input-field select">
          <span className="spanForm">Genre :</span>
          <Select value={gender !== null ? gender : ''} onChange={value => setGender(value)} className="selectForm" style={{ width: 200 }}>
            <Option value="female">Feminin</Option>
            <Option value="male">Masculin</Option>
          </Select>
        </Col>
        <Col sm={24} md={8} className="input-field">
          <span className="spanForm">Date d&apos;adhésion :</span>
          <i className="material-icons">calendar_today</i>
          <DatePicker
            locale="fr"
            dateFormat="dd/MM/yyyy"
            selected={membershipDateLast && new Date(membershipDateLast)}
            onChange={date => date && setMembershipDateLast(date)}
          />
        </Col>
        <Col sm={24} md={8} className="input-field">
          <span className="spanForm">Date de naissance :</span>
          <i className="material-icons">calendar_today</i>
          <DatePicker
            locale="fr"
            dateFormat="dd/MM/yyyy"
            selected={birthday && new Date(birthday)}
            onChange={date => date && setBirthday(date)}
          />
        </Col>
      </Row>
      <Row>
        <Col sm={24} md={12} className="input-field">
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
        </Col>
        <Col sm={24} md={12} className="input-field">
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
        </Col>
      </Row>
      <Row>
        <Col sm={24} md={12} className="input-field">
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
        </Col>
        <Col sm={24} md={12} className="input-field">
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
        </Col>
      </Row>
      <Row>
        <Col sm={24} md={12} className="input-field">
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
        </Col>
        <Col sm={24} md={12} className="input-field">
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
        </Col>
      </Row>
      <Row>
        <Col sm={24} md={12} className="input-field">
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
        </Col>
        <Col sm={24} md={12} className="input-field">
          <label>
            <input
              type="checkbox"
              id="check_neighborhood"
              checked={neighborhood ? 'checked' : ''}
              onChange={event => setNeighborhood(event.target.checked)}
            />
            <span>Habite dans le quartier</span>
          </label>
        </Col>
      </Row>
      <Row>
        <Col sm={24} md={12} className="input-field">
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
        </Col>
        <Col sm={24} md={12} className="input-field">
          <label>
            <input
              type="checkbox"
              id="check_member_active"
              checked={memberActive ? 'checked' : ''}
              onChange={event => setMemberActive(event.target.checked)}
            />
            <span>Membre actif</span>
          </label>
        </Col>
      </Row>
      <Row>
        <Col sm={24} md={6} className="input-field">
          <label>
            <input
              type="checkbox"
              id="check_image_copyright"
              checked={imageCopyright ? 'checked' : ''}
              onChange={event => setImageCopyright(event.target.checked)}
            />
            <span>Droit à l&apos;image</span>
          </label>
        </Col>
        <Col sm={24} md={6} className="input-field">
          <label>
            <input
              type="checkbox"
              id="check_mailing_active"
              checked={mailingActive ? 'checked' : ''}
              onChange={event => setMailingActive(event.target.checked)}
            />
            <span>Accepte l&apos;envoie de mail</span>
          </label>
        </Col>
        <Col sm={24} md={6} className="input-field">
          <button
            type="button"
            className="waves-effect waves-light btn-small teal darken-1 white-text right col s4"
            onClick={handleSend}
          >
            Envoyer
          </button>
        </Col>
        <Col sm={24} md={6} className="input-field">
          <button
            type="button"
            className="waves-effect waves-light btn-small teal darken-1 white-text right col s4"
            onClick={handleClose}
          >
            Fermer
          </button>
        </Col>
      </Row>
    </div>
  );
}

FormMember.propTypes = {
  userSelected: PropTypes.objectOf(PropTypes.object),
  dispatch: PropTypes.func,
};

FormMember.defaultProps = {
  userSelected: null,
  dispatch: null,
};

export default connect()(FormMember);
