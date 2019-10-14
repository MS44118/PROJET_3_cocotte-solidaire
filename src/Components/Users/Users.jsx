import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import _ from 'underscore';
import {
  message, Modal, Select,
} from 'antd';
import FormMember from '../FormMember/FormMember';
import setHeaderToken from '../../Utils/tokenUtil';
import conf from '../../app.conf';
import './Users.css';

// ACTIONS
import { displayNewUserFormAction, displayKnownUserFormAction } from '../../Actions/displayUserFormAction';

function Users(
  {
    displayNewUser, displayKnownUser, updateUser, newUser, dispatch,
  },
) {
  const { confirm } = Modal;
  const { Option } = Select;
  const [users, setUsers] = useState([]);
  const [userList, setUserList] = useState([]);
  const [activeFormMember, setActiveFormMember] = useState([]);
  const [filterFirstName, setFilterFirstName] = useState(false);
  const [filterLastName, setFilterLastName] = useState(false);
  const [filterMemberId, setFilterMemberId] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    setHeaderToken(() => {
      axios.get(`${conf.url}/api/users`)
        .then((data) => {
          setUsers(data.data);
          setUserList(data.data.slice(0, 20));
        })
        .catch(() => {
          message.error('Problème lors de la récupération des utilisateurs.', 3);
        });
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
    const arrayTemp = [...activeFormMember];
    arrayTemp[index] = !activeFormMember[index];
    setActiveFormMember(arrayTemp);
    dispatch(displayKnownUserFormAction('block'));
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
    if (searchValue > 0) {
      const arrayFilter = users.filter(user => user.idUser === parseInt(searchValue, 10));
      setUserList(arrayFilter);
    } else if (parseInt(searchValue, 10) === 0) {
      setUserList(users);
    }
  }, [searchValue]);

  const showDeleteConfirm = (index) => {
    confirm({
      title: `Etes vous sur de vouloir supprimer l'adhérent: ${userList[index].firstname} ${userList[index].lastname}?`,
      okText: 'Oui',
      okType: 'danger',
      cancelText: 'Non',
      onOk() {
        setHeaderToken(() => {
          axios.put(`${conf.url}/api/user/anonym/${userList[index].idUser}`)
            .then((res) => {
              if (res.status === 200) {
                const arrayTemp = [...userList];
                arrayTemp.splice(index, 1);
                setUserList(arrayTemp);
                message.success('La suppression a bien été prise en compte', 3);
              }
            })
            .catch(() => {
              message.error("Une erreur s'est produite. Merci de réessayer", 3);
            });
        });
      },
      onCancel() {
      },
    });
  };

  return (
    <div className="container">
      <div className="row title">
        <h2>
          Liste des utilisateurs / adhérents
        </h2>
      </div>
      <div className="topTable">
        <div>
          <Select
            showSearch
            style={{ width: 300 }}
            placeholder="Rechercher un adhérent"
            optionFilterProp="children"
            onChange={value => setSearchValue(value)}
            filterOption={(inputValue, option) => option.props.children.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().indexOf(inputValue.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase()) !== -1}
          >
            <Option value="0">Tous les adhérents</Option>
            {users.map((user, index) => (
              <Option key={user[index]} value={user.idUser}>{`${user.memberId} ${user.firstname} ${user.lastname}`}</Option>
            ))}
          </Select>
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
        <li style={{ display: displayNewUser }}><FormMember userSelected={{ type: 'new' }} /></li>
        <li className="collection-item-header row center-align">
          <span className="col s4 m2">
            N°adhérent
            <i role="button" tabIndex="0" onClick={() => filterUsers('memberId', [filterMemberId, setFilterMemberId])} onKeyDown={() => filterUsers('memberId', [filterMemberId, setFilterMemberId])} className="material-icons user-icon">unfold_more</i>
          </span>
          <span className="col s4 m2">
            Nom
            <i role="button" tabIndex="0" onClick={() => filterUsers('lastname', [filterLastName, setFilterLastName])} onKeyDown={() => filterUsers('lastname', [filterLastName, setFilterLastName])} className="material-icons user-icon">unfold_more</i>
          </span>
          <span className="col s4 m2">
            Prénom
            <i role="button" tabIndex="0" onClick={() => filterUsers('firstname', [filterFirstName, setFilterFirstName])} onKeyDown={() => filterUsers('firstname', [filterFirstName, setFilterFirstName])} className="material-icons user-icon">unfold_more</i>
          </span>
          <span className="col s4 m2">Tel</span>
          <span className="col s4 m2">Mail</span>
          <span className="col s4 m2" />
        </li>
        {userList.length && userList.map((user, index) => (
          <div key={user.idUser}>
            <li className="collection-item row">
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
                  onClick={() => showDeleteConfirm(index)}
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
  updateUser: PropTypes.arrayOf(PropTypes.object),
  newUser: PropTypes.arrayOf(PropTypes.object),
};

Users.defaultProps = {
  displayNewUser: null,
  displayKnownUser: null,
  dispatch: null,
  updateUser: null,
  newUser: null,
};

export default connect(mapStateToProps)(Users);
