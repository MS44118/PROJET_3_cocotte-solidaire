import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { Tooltip, message, Modal } from 'antd';

import './ReservationHome.css';
import 'antd/dist/antd.css';

function ReservationHome(props) {
  const [registrations, setRegistrations] = useState([]);

  // ESLINT WARNING: to prevent definitions of unused prop types
  const [eventProps, setEventProps] = useState({});
  useEffect(() => setEventProps(props), [props]);

  // get the registrations details from database
  useEffect(() => {
    axios.get('http://localhost:8000/api/future-registrations')
      .then((result) => {
        setRegistrations(result.data);
      });
  }, []);

  // state to show/hide Modale (to confirm registrations deletion)
  const [deleteModal, setDeleteModal] = useState([]);
  
  // create the list of modal State for each registration (visible true/false)
  useEffect(() => {
    let array = [];
    array = registrations.map(() => (false));
    setDeleteModal(array);
  }, [registrations]);

  // handle the show/hide Modale
  const handleStateMapped = (i, state, func) => {
    func(
      [
        ...state.slice(0, [i]),
        !state[i],
        ...state.slice([i + 1], state.length),
      ],
    );
  };

  // delete function (once you hit the confirmation button)
  const deleteRegistration = (id) => {
    message.config({
      top: 150,
      duration: 2,
      maxCount: 3,
    });
    axios.delete(`http://localhost:8000/registration/${id}`)
      .then((res) => {
        message.success(res.data);
      })
      .catch((err) => {
        message.error(`inscription ${id} ne peut pas être supprimé: ${err}`);
      });
  };


  return (
    <div className="row list-registrations">

      {/* entetes liste des réservations */}
      <ul className="registration-header">
        <li className="col s1">n°adhérent</li>
        <li className="col s1">prénom</li>
        <li className="col s1">nom</li>
        <li className="col col-icon s1">adultes</li>
        <li className="col col-icon s1">enfants</li>
        <li className="col s1">téléphone</li>
        <li className="col col-icon s1">email</li>
        <li className="col col-icon s1">allergies</li>
        <li className="col col-icon s1">commentaires</li>
        <li className="col col-icon s1"><i className="material-icons icon-green">create</i></li>
        <li className="col col-icon s1"><i className="material-icons icon-green">delete_forever</i></li>
        <li className="col col-icon s1"> </li>
      </ul>

      {/* liste des réservations */}
      {registrations
        .filter(registration => registration.event_id === eventProps.eventId)
        .map((registration, index) => (
          <ul key={registration.id_registration} className="registration-item">
            <li className="col s1">{registration.member_id}</li>
            <li className="col s1">{registration.firstname}</li>
            <li className="col s1">{registration.lastname}</li>
            <li className="col col-icon s1">{registration.quantity_adult}</li>
            <li className="col col-icon s1">{registration.quantity_children}</li>
            <li className="col s1">{registration.phone}</li>
            <li className="col col-icon s1">
              { registration.email === ' ' || '' || !registration.email
                ? (
                  <Tooltip title="envoyer un SMS">
                    <i className="material-icons warning-icon">email</i>
                  </Tooltip>
                )
                : null
              }
            </li>
            <li className="col col-icon s1">
              { registration.allergie === ' ' || '' || !registration.allergie
                ? null
                : (
                  <Tooltip title={registration.allergie}>
                    <i className="material-icons warning-icon">warning</i>
                  </Tooltip>
                )
              }
            </li>
            <li className="col col-icon s1">
              { registration.comment === ' ' || '' || !registration.comment
                ? null
                : (
                  <Tooltip title={registration.comment}>
                    <i className="material-icons icon-green">comment</i>
                  </Tooltip>
                )
              }
            </li>
            <li className="col col-icon s1">
            <Link to={{
              pathname: '/reservation',
              search: `id=${registration.id_registration}`,
            }}>
                <i className="material-icons icon-green">create</i>
              </Link>
            </li>

            <li className="col col-icon s1">
              <button
                type="submit"
                className="button link-button"
                onClick={() => handleStateMapped(index, deleteModal, setDeleteModal)}
              >
                <i className="material-icons icon-green">delete_forever</i>
              </button>
              <Modal
                title={(
                  <h3>
                    {'atelier '}
                    {eventProps.eventName}
                    {' du '}
                    {moment(eventProps.eventDate).format('dddd Do/MM/YY')}
                  </h3>
                )}
                visible={deleteModal[index]}
                onOk={() => {
                  handleStateMapped(index, deleteModal, setDeleteModal);
                  deleteRegistration(registration.id_registration);
                }}
                onCancel={() => handleStateMapped(index, deleteModal, setDeleteModal)}
                footer={[
                  <button type="submit" key="back" onClick={() => handleStateMapped(index, deleteModal, setDeleteModal)}>
                    annuler
                  </button>,
                  <button
                    type="submit"
                    key="submit"
                    onClick={() => {
                      handleStateMapped(index, deleteModal, setDeleteModal);
                      deleteRegistration(registration.id_registration);
                    }}
                  >
                    Supprimer
                  </button>,
                ]}
              >
                <h4>ATTENTION vous allez supprimer l'inscription de : </h4>
                <p>
                  {registration.firstname}
                  {' '}
                  {registration.lastname}
                </p>
                <p>
                  {registration.quantity_adult}
                  {' adulte(s)'}
                </p>
                <p>
                  {registration.quantity_children}
                  {' enfant(s)'}
                </p>
              </Modal>
            </li>




            <li className="col col-icon s1"> </li>
          </ul>
        ))
      }

    </div>
  );
}

export default ReservationHome;
