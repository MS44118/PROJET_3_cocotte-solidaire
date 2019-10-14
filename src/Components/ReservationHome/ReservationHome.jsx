import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import moment from 'moment';
import { Tooltip, message, Modal } from 'antd';
import conf from '../../app.conf';
import setHeaderToken from '../../Utils/tokenUtil';

import './ReservationHome.css';
import 'antd/dist/antd.css';

// REDUX ACTIONS
import { removeRegistrationAction, updateEventAction } from '../../Actions/homeAction';

function ReservationHome(
  {
    eventId, eventName, eventDate, registrations, dispatch,
  },
) {
  // state to show/hide Modale (to confirm registrations deletion)
  const [deleteModal, setDeleteModal] = useState([]);

  // create the list of modal State for each registration (visible true/false)
  useEffect(() => {
    setDeleteModal(registrations.map(() => (false)));
  }, [registrations]);

  // delete function (once you hit the confirmation button)
  const deleteRegistration = (id) => {
    let resultat = {};
    setHeaderToken(() => {
      axios.delete(`${conf.url}/api/registration/${id}`)
        .then((res) => {
          message.success(res.data, 3);
          resultat = res.data;
        })
        .then(() => {
          if (resultat === 200) {
            dispatch(updateEventAction({ regId: id, reg: registrations }));
          } else {
            message.warning(resultat, 3);
          }
        })
        .then(() => {
          if (resultat === 200) {
            dispatch(removeRegistrationAction(id));
          } else {
            message.warning(resultat, 3);
          }
        })
        .catch((err) => {
          message.error(err.response.data, 3);
        });
    });
  };

  // Modal to delete a registration
  const { confirm } = Modal;
  const showDeleteConfirm = (index) => {
    confirm({
      title:
        `ATTENTION vous allez supprimer l'inscription n°${registrations[index].id_registration} de 
        ${registrations[index].firstname} ${registrations[index].lastname}
        (${registrations[index].quantity_adult} adultes et 
          ${registrations[index].quantity_children === null ? 0 : registrations[index].quantity_children} enfants)
        pour l'évenement n°${registrations[index].event_id} - ${eventName} du ${moment(eventDate).format('dddd Do/MM/YY')}`,
      okType: 'danger',
      okText: 'Supprimer',
      cancelText: 'Annuler',
      onOk() {
        setDeleteModal(
          [
            ...deleteModal.slice(0, [index]),
            !deleteModal[index],
            ...deleteModal.slice([index + 1], deleteModal.length),
          ],
        );
        deleteRegistration(registrations[index].id_registration);
      },
      onCancel() {
        setDeleteModal(
          [
            ...deleteModal.slice(0, [index]),
            !deleteModal[index],
            ...deleteModal.slice([index + 1], deleteModal.length),
          ],
        );
      },
    });
  };

  return (
    <div className="row list-registrations">
      {/* entetes liste des réservations */}
      <ul className="registration-header">
        <li className="col s1 hide-on-med-and-down">n°adhérent</li>
        <li className="col s2 hide-on-large-only">prénom nom</li>
        <li className="col s1 hide-on-med-and-down">prénom</li>
        <li className="col s1 hide-on-med-and-down">nom</li>
        <li className="col col-icon s1 hide-on-med-and-down">adultes</li>
        <li className="col col-icon s1 hide-on-large-only">
          <Tooltip title="nb adultes" trigger="click hover">
            <i className="material-icons icon-green" title="nb adultes">person_outline</i>
          </Tooltip>
        </li>
        <li className="col col-icon s1 hide-on-med-and-down">enfants</li>
        <li className="col col-icon s1 hide-on-large-only">
          <Tooltip title="nb enfants" trigger="click hover">
            <i className="material-icons icon-green" title="nb enfants">child_care</i>
          </Tooltip>
        </li>
        <li className="col s1 hide-on-med-and-down">téléphone</li>
        <li className="col col-icon s1"><i className="material-icons icon-green">email</i></li>
        <li className="col col-icon s1"><i className="material-icons icon-green">warning</i></li>
        <li className="col col-icon s1"><i className="material-icons icon-green">comment</i></li>
        <li className="col col-icon s1"><i className="material-icons icon-green">create</i></li>
        <li className="col col-icon s1"><i className="material-icons icon-green">delete_forever</i></li>
        <li className="col col-icon s1"> </li>
      </ul>

      {/* liste des réservations */}
      {registrations
        .filter(registration => registration.event_id === eventId)
        .map(registration => (
          <ul key={registration.id_registration} className="registration-item">
            <li className="col s1 hide-on-med-and-down">{registration.member_id}</li>
            <li className="col s2 hide-on-large-only">
              {registration.firstname}
              {' '}
              {registration.lastname}
            </li>
            <li className="col s1 hide-on-med-and-down">{registration.firstname}</li>
            <li className="col s1 hide-on-med-and-down">{registration.lastname}</li>
            <li className="col col-icon s1">{registration.quantity_adult}</li>
            <li className="col col-icon s1">{registration.quantity_children}</li>
            <li className="col s1 hide-on-med-and-down">{registration.phone}</li>
            <li className="col col-icon s1">
              { registration.email === ' ' || '' || !registration.email
                ? (
                  <Tooltip title="envoyer un SMS" trigger="click hover">
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
                  <Tooltip title={registration.allergie} trigger="click hover">
                    <i className="material-icons warning-icon">warning</i>
                  </Tooltip>
                )
              }
            </li>
            <li className="col col-icon s1">
              { registration.comment === ' ' || '' || !registration.comment
                ? null
                : (
                  <Tooltip title={registration.comment} trigger="click hover">
                    <i className="material-icons icon-green">comment</i>
                  </Tooltip>
                )
              }
            </li>
            <li className="col col-icon s1">
              <Link to={{
                pathname: '/reservation',
                search: `id=${registration.id_registration}`,
              }}
              >
                <i className="material-icons icon-green">create</i>
              </Link>
            </li>

            <li className="col col-icon s1">
              <button
                type="button"
                className="button link-button"
                onClick={() => {
                  const idReg = registration.id_registration;
                  const indexReg = registrations.findIndex(i => i.id_registration === idReg);
                  showDeleteConfirm(indexReg);
                }}
              >
                <i className="material-icons icon-green">delete_forever</i>
              </button>
            </li>

            <li className="col col-icon s1"> </li>
          </ul>
        ))
      }

    </div>
  );
}


ReservationHome.propTypes = {
  dispatch: PropTypes.func,
  registrations: PropTypes.arrayOf(PropTypes.object),
  eventId: PropTypes.number,
  eventName: PropTypes.string,
  eventDate: PropTypes.string,
};

ReservationHome.defaultProps = {
  dispatch: null,
  registrations: [],
  eventId: null,
  eventName: null,
  eventDate: null,
};

export default connect()(ReservationHome);
