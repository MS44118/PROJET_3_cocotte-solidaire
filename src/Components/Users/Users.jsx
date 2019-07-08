import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import _ from 'underscore';
import FormMember from '../FormMember/FormMember';
import { Input, Icon, AutoComplete } from 'antd';
import './Users.css';

// ACTIONS
import { displayNewUserFormAction, displayKnownUserFormAction } from '../../Actions/displayUserFormAction';

function Users(
  {
    displayNewUser, displayKnownUser, updateUser, newUser, dispatch,
  },
) {
  const [users, setUsers] = useState([]);
  const [userList, setUserList] = useState([]);
  const [activeFormMember, setActiveFormMember] = useState([]);
  const [filterFirstName, setFilterFirstName] = useState(false);
  const [filterLastName, setFilterLastName] = useState(false);
  const [filterMemberId, setFilterMemberId] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/users')
      .then((data) => {
        setUsers(data.data);
        setUserList(data.data.slice(0, 20));
        let dataTemp = ['0 Tous les adhérents'];
        for (let i = 0; i < data.data.length; i += 1) {
          dataTemp = [...dataTemp, `${data.data[i].idUser} ${data.data[i].firstname} ${data.data[i].lastname}`]
        }
        setDataSource(dataTemp)
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

  const filterUsers = (tag, [param, setFunc]) => {
    if (param) {
      setUserList(userList.reverse());
    } else {
      setUserList(userList.sort((a, b) => (a[tag] > b[tag] ? 1 : -1)));
    }
    setFunc(!param);
  };

  useEffect(() => {
    console.log(searchValue)
    if (searchValue > 0){
      console.log(users)
      const arrayFilter = users.filter((user) => user.idUser === parseInt(searchValue));
      setUserList(arrayFilter);
      console.log(arrayFilter)
    } else if (parseInt(searchValue) === 0) {
      setUserList(users);
    }
  },[searchValue]);

  return (
    <div className="container">
      <div className="row title">
        <h2>
          Liste des utilisateurs / adhérents
        </h2>
      </div>
      <div className="topTable">
        <div>
          <AutoComplete
            style={{ width: 300 }}
            dataSource={dataSource}
            onSelect={(value, option) => setSearchValue(value.split(' ')[0])}
            placeholder="Recherche (par nom ou prénom)"
            filterOption={(inputValue, option) =>
              option.props.children.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().indexOf(inputValue.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase()) !== -1
            }
          >
            <Input suffix={<Icon type="search" className="certain-category-icon" />} />
          </AutoComplete>
        </div>
        <button
          type="button"
          className="waves-effect waves-light btn-small teal darken-1 white-text buttonNew"
          onClick={() => dispatch(displayNewUserFormAction('block'))}
        >
          Nouvel adhérent
        </button>
      </div>
      <ul className="collection">
        <li style={{ display: displayNewUser }}><FormMember userSelected="new" /></li>
        <li className="collection-item-header row center-align">
          <textbox className="col s4 m2" onClick={() => filterUsers('memberId', [filterMemberId, setFilterMemberId])}>N°adhérent</textbox>
          <textbox className="col s4 m2" onClick={() => filterUsers('lastname', [filterLastName, setFilterLastName])}>Nom</textbox>
          <textbox className="col s4 m2" onClick={() => filterUsers('firstname', [filterFirstName, setFilterFirstName])}>Prénom</textbox>
          <textbox className="col s4 m2">Tel</textbox>
          <textbox className="col s4 m2">Mail</textbox>
          <textbox className="col s4 m2" />
        </li>
        {userList.length && userList.map((user, index) => (
          <div key={user[index]}>
            <li className="collection-item row center-align">
              <p className="col s4 m2">{user.memberId}</p>
              <p className="col s4 m2">{user.lastname}</p>
              <p className="col s4 m2">{user.firstname}</p>
              <p className="col s4 m2">{user.phone}</p>
              <p className="col s4 m2">{user.email}</p>
              <p className="col s4 m2">
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
              </p>
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
