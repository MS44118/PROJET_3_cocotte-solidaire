import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FormMember from './../FormMember/FormMember';

function Users() {
  const [userList, setUserList] = useState([]);
  const [activeFormMember, setActiveFormMember] = useState([]);
  const [newMember, setNewMember] = useState(false)
  const [display, setDisplay] = useState('none')

  useEffect(() => {
    console.log('tata')
    axios.get('http://localhost:8000/users')
      .then(data => {
        setUserList(data.data)
      });
  }, [])

  useEffect(() => {
    let arrayTemp = [];
    for (let i = 0; i < userList.length; i++) {
      arrayTemp[i] = false;
      setActiveFormMember(arrayTemp)
    }
  }, [userList.length])

  const handleClick = (index) => {
    let arrayTemp = activeFormMember;
    arrayTemp[index] = !activeFormMember[index]
    setActiveFormMember(arrayTemp);
    setDisplay('block')
  }

  return (
    <div>
      <ul className="collection with-header">
        <li className="collection-header row">
          <h4>Liste des utilisateurs / adhérents</h4>
          <button
            className="waves-effect waves-light btn-small teal white-text right"
            onClick={() => setNewMember(true)}>Nouvel adhérent</button>
        </li>
        {newMember? <FormMember userSelected='new' /> : ''}
        <li className="collection-item row center-align">
          <p className="col s2">N°adhérent</p>
          <p className="col s2">Nom</p>
          <p className="col s2">Prénom</p>
          <p className="col s2">Tel</p>
          <p className="col s2">Mail</p></li>
        {userList.length && userList.map((user, index) => (
          <div key={index}>
            <li className="collection-item row center-align" >
              <p className="col s2">{user.member_id}</p>
              <p className="col s2">{user.lastname}</p>
              <p className="col s2">{user.firstname}</p>
              <p className="col s2">{user.phone}</p>
              <p className="col s2">{user.email}</p>
              <button
                className="waves-effect waves-light btn-small teal white-text col right"
                onClick={() => handleClick(index)}><i className="material-icons">create</i></button>
            </li>
            <li style={{display: activeFormMember[index] ? 'block' : 'none' }}><FormMember userSelected={activeFormMember[index] ? {user} : ''} /></li>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default Users;
