import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import _ from 'underscore';
import FormMember from '../FormMember/FormMember';
import './Users.css';

// ACTIONS
import { displayNewUserFormAction, displayKnownUserFormAction } from '../../Actions/displayUserFormAction';

function Users(
  {
    displayNewUser, displayKnownUser, updateUser, newUser, dispatch,
  },
) {
  const [userList, setUserList] = useState([]);
  const [activeFormMember, setActiveFormMember] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/users')
      .then((data) => {
        setUserList(data.data);
      });
  }, []);

  useEffect(() => {
    const arrayTemp = [];
    if (displayKnownUser === 'none') {
      for (let i = 0; i < userList.length; i += 1) {
        arrayTemp[i] = false;
        setActiveFormMember(arrayTemp);
      }
    }
  }, [userList.length, displayKnownUser]);

  useEffect(() => {
    const arrayTemp = [...userList];
    const index = _.findIndex(arrayTemp, user => user.idUser === updateUser.idUser);
    arrayTemp[index] = updateUser;
    setUserList(arrayTemp);
  }, [updateUser]);

  useEffect(() => {
    const arrayTemp = [...userList, newUser];
    setUserList(arrayTemp);
  }, [newUser]);

  const handleCreate = (index) => {
    const arrayTemp = activeFormMember;
    arrayTemp[index] = !activeFormMember[index];
    setActiveFormMember(arrayTemp);
    dispatch(displayKnownUserFormAction('block'));
  };

  const handleDelete = (index) => {
    axios.put(`http://localhost:8000/user/anonym/${userList[index].idUser}`)
      .then((res) => {
        console.log(res.statusText);
        if (res.status === 200) {
          const arrayTemp = [...userList];
          arrayTemp.splice(index, 1);
          setUserList(arrayTemp);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <ul className="collection with-header">
        <li className="collection-header row">
          <h4>Liste des utilisateurs / adhérents</h4>
          <button
            type="button"
            className="waves-effect waves-light btn-small teal darken-1 white-text right"
            onClick={() => dispatch(displayNewUserFormAction('block'))}
          >
            Nouvel adhérent
          </button>
        </li>
        <li style={{ display: displayNewUser }}><FormMember userSelected="new" /></li>
        <li className="collection-item-header row center-align">
          <p className="col s2">N°adhérent</p>
          <p className="col s2">Nom</p>
          <p className="col s2">Prénom</p>
          <p className="col s2">Tel</p>
          <p className="col s2">Mail</p>
        </li>
        {userList.length && userList.map((user, index) => (
          <div key={user[index]}>
            <li className="collection-item row center-align">
              <p className="col s2">{user.memberId}</p>
              <p className="col s2">{user.lastname}</p>
              <p className="col s2">{user.firstname}</p>
              <p className="col s2">{user.phone}</p>
              <p className="col s2">{user.email}</p>
              <button
                type="button"
                className="waves-effect waves-light btn-small teal darken-1 white-text col"
                onClick={() => handleCreate(index)}
              >
                <i className="material-icons">create</i>
              </button>
              <button
                type="button"
                className="waves-effect waves-light btn-small teal darken-1 white-text col right"
                onClick={() => handleDelete(index)}
              >
                <i className="material-icons">delete</i>
              </button>
            </li>
            <li style={{ display: activeFormMember[index] ? 'block' : 'none' }}><FormMember userSelected={activeFormMember[index] ? { user } : ''} /></li>
          </div>
        ))}
      </ul>
    </div>
  );
}

const mapStateToProps = store => ({
  displayNewUser: store.displayUserForm.newUser,
  displayKnownUser: store.displayUserForm.knownUser,
  updateUser: store.user.updateUser,
  newUser: store.user.newUser,
});

Users.propTypes = {
  displayNewUser: PropTypes.string,
  displayKnownUser: PropTypes.string,
  dispatch: PropTypes.func,
  updateUser: PropTypes.shape({
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
  newUser: PropTypes.shape({
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
};

Users.defaultProps = {
  displayNewUser: null,
  displayKnownUser: null,
  dispatch: null,
  updateUser: null,
  newUser: null,
};

export default connect(mapStateToProps)(Users);