import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import FormMember from '../FormMember/FormMember';
import './Users.css';

// ACTIONS
import { displayNewUserFormAction, displayKnownUserFormAction } from '../../Actions/displayUserFormAction';

function Users({ displayNewUser, displayKnownUser, dispatch }) {
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

  const handleClick = (index) => {
    const arrayTemp = activeFormMember;
    arrayTemp[index] = !activeFormMember[index];
    setActiveFormMember(arrayTemp);
    dispatch(displayKnownUserFormAction('block'));
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
          <div key={userList[index]}>
            <li className="collection-item row center-align">
              <p className="col s2">{user.member_id}</p>
              <p className="col s2">{user.lastname}</p>
              <p className="col s2">{user.firstname}</p>
              <p className="col s2">{user.phone}</p>
              <p className="col s2">{user.email}</p>
              <button
                type="button"
                className="waves-effect waves-light btn-small teal darken-1 white-text col right"
                onClick={() => handleClick(index)}
              >
                <i className="material-icons">create</i>
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
  displayNewUser: store.newUser,
  displayKnownUser: store.knownUser,
});

Users.propTypes = {
  displayNewUser: PropTypes.string,
  displayKnownUser: PropTypes.string,
  dispatch: PropTypes.func,
};

export default connect(mapStateToProps)(Users);
