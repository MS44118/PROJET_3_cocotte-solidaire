import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import moment from 'moment';
import { Tooltip, message, Modal } from 'antd';
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
  // ESLINT WARNING: to prevent definitions of unused prop types
  // const [homeProps, setHomeProps] = useState({});
  // useEffect(() => {
  //   setHomeProps(props);
  // }, [props]);

  // get the registrations details from database
  // useEffect(() => {
  //   setHeaderToken(() => {
  //     axios.get('http://localhost:8000/api/future-registrations')
  //       .then((result) => {
  //         setRegistrations(result.data);
  //         props.dispatch(initRegistrationsAction(result.data));
  //       });
  //   });
  // }, []);

  // state to show/hide Modale (to confirm registrations deletion)
  const [deleteModal, setDeleteModal] = useState([]);

  // create the list of modal State for each registration (visible true/false)
  useEffect(() => {
    setDeleteModal(registrations.map(() => (false)));
  }, [registrations]);

  // handle the show/hide Modale to confirm deletion
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
      top: 200,
      duration: 4,
      maxCount: 3,
    });
    let resultat = {};
    setHeaderToken(() => {
      axios.delete(`http://localhost:8000/registration/${id}`)
        .then((res) => {
          message.success(res.data);
          resultat = res.status;
        })
        .then(() => {
          if (resultat === 200) {
            dispatch(updateEventAction({ regId: id, reg: registrations }));
          } else {
            message.warning(resultat);
          }
        })
        // .then(() => {
        //   if (resultat === 200) {
        //     dispatch(removeRegistrationAction(id));
        //   } else {
        //     message.warning(resultat);
        //   }
        // })
        .catch((err) => {
          message.error(`inscription ${id} ne peut pas être supprimé: ${err}`);
        });
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
        <li className="col col-icon s1 hide-on-large-only"><i className="material-icons icon-green" title="nb adultes">person_outline</i></li>
        <li className="col col-icon s1 hide-on-med-and-down">enfants</li>
        <li className="col col-icon s1 hide-on-large-only"><i className="material-icons icon-green" title="nb enfants">child_care</i></li>
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
        .map((registration, index) => (
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
              }}
              >
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
                    {eventName}
                    {' du '}
                    {moment(eventDate).format('dddd Do/MM/YY')}
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
                <h4>{`ATTENTION vous allez supprimer l'inscription n°${registration.id_registration} de l'évenement n°${registration.event_id}: `}</h4>
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
// export default ReservationHome;
