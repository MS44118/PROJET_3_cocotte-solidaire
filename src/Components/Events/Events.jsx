import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { message } from 'antd';
import DatePicker, { registerLocale } from 'react-datepicker';
import moment from 'moment';
import fr from 'date-fns/locale/fr';
import M from 'materialize-css/dist/js/materialize';
import conf from '../../app.conf';
import setHeaderToken from '../../Utils/tokenUtil';
import './Events.css';

registerLocale('fr', fr);

function Events({ match }) {
  // ----------------------------------------HOOKS-----------------------------------------------
  const [activities, setActivities] = useState([]);
  const [events, setEvents] = useState({});
  const [selectValue, setSelectValue] = useState('default');
  const [id, setId] = useState(match.params.id);
  const [idActivity, setIdActivity] = useState(null);
  const [title, setTitle] = useState('');
  const [describtion, setDescribtion] = useState('');
  const [dateBegin, setDateBegin] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [capacite, setCapacite] = useState('');
  const [address, setAddress] = useState('La cocotte solidaire - Ile de versailles, 44000 Nantes');
  const [file, setFile] = useState('');
  const [indexSup, setIndexSup] = useState('default');
  const [nameFile, setNameFile] = useState('');
  const [active, setActive] = useState('');
  const [emptyFile, setEmptyFile] = useState(0);
  const [recharge, setRecharge] = useState(0);
  const [redirection, setRedirection] = useState(false);

  // -----------------------------------CHANGEMENT STATE-------------------------------------------
  const handleChange = (event, setHook) => setHook(event.target.value.replace('/', ''));
  const handleChangeFile = (event) => {
    setEmptyFile(1);
    setFile(event.target.files[0] ? URL.createObjectURL(event.target.files[0]) : false);
    setNameFile(event.target);
  };
  const valueSelected = (event) => {
    setIndexSup(event.target.value);
    setSelectValue(activities[event.target.value] ? activities[event.target.value] : 'default');
    setTitle(activities[event.target.value] ? activities[event.target.value].name : '');
    setDescribtion(activities[event.target.value] ? activities[event.target.value].description : '');
    setFile(activities[event.target.value] ? activities[event.target.value].picture : '');
    setActive(event.target.value === 'defaul' ? '' : 'active');
  };

  // --------------------------------------REQUETES-----------------------------------------------
  const submitEvents = () => {
    let newFile;
    if (emptyFile === 1) {
      const file1 = nameFile;
      const fileName = `event-${title}.jpg`;
      const blob = file1.files[0].slice(0, file1.files[0].size, 'image/jpg');
      newFile = new File([blob], fileName, { type: 'image/jpg' });
      const data = new FormData();
      data.append('file', newFile);
      setHeaderToken(() => {
        axios.post(`${conf.url}/api/uploaddufichier/`, data)
          .then(() => {
            message.success('Activité crée !');
          })
          .catch((error) => {
            message.success(`${error}`);
          });
      });
    }
    setHeaderToken(() => {
      axios.post(`${conf.url}/api/events/`, {
        dateB: `${moment(dateBegin).format('YYYY-MM-DD HH:mm:ss')}`,
        dateE: `${moment(dateEnd).format('YYYY-MM-DD HH:mm:ss')}`,
        nameEvent: (indexSup === 'default' ? false : title === activities[indexSup].name) ? '' : title,
        capacity: capacite,
        addressEvent: address,
        descriptionEvent: (indexSup === 'default' ? false : describtion === activities[indexSup].description) ? '' : describtion,
        pictureEvent: emptyFile === 1 ? `/images/${newFile.name}` : '',
        activityId: indexSup !== 'default' ? activities[indexSup].id_activity : 3,
      })
        .then((res) => {
          if (res.status === 200) {
            message.success('Activité crée !');
            setTitle('');
            setDescribtion('');
            setFile('');
            setNameFile('');
            setCapacite('');
            setDateBegin('');
            setDateEnd('');
            setAddress('');
            setSelectValue('default');
            setIndexSup('default');
            setEmptyFile(0);
            setRecharge(1);
          }
        })
        .catch((error) => {
          message.success(`${error}`);
        });
    });
  };

  const modifyEvents = () => {
    let newFile;
    if (emptyFile === 1) {
      const file1 = nameFile;
      const fileName = `event-${title}.jpg`;
      const blob = file1.files[0].slice(0, file1.files[0].size, 'image/jpg');
      newFile = new File([blob], fileName, { type: 'image/jpg' });
      const data = new FormData();
      data.append('file', newFile);
      setHeaderToken(() => {
        axios.post(`${conf.url}/api/uploaddufichier/`, data, {
        })
          .then(() => {
            message.success(`Votre activité ${title} à ete modifiee`);
          })
          .catch((error) => {
            message.success(`${error}`);
          });
      });
    }
    const myCrazyTernary = file === activities.filter(activity => activity.id_activity === events[0].activity_id)[0].picture ? '' : file;
    setHeaderToken(() => {
      axios.put(`${conf.url}/api/events/${id}`, {
        dateB: `${moment(dateBegin).format('YYYY-MM-DD HH:mm:ss')}`,
        dateE: `${moment(dateEnd).format('YYYY-MM-DD HH:mm:ss')}`,
        capacity: capacite,
        addressEvent: address,
        nameEvent: title === activities.filter(activity => activity.id_activity === events[0].activity_id)[0].name ? '' : title,
        descriptionEvent: describtion === activities.filter(activity => activity.id_activity === events[0].activity_id)[0].description ? '' : describtion,
        pictureEvent: emptyFile === 1 ? `/images/${newFile.name}` : myCrazyTernary,
        activityId: events[0].activity_id,
      })
        .then(() => {
          message.success(`Votre activité ${title} à ete modifiee`);
        })
        .catch((error) => {
          message.success(`${error}`);
        });
    });
    setTimeout(() => setRedirection(true), 2000);
  };

  // ---------------------------------------GET EVENTS----------------------------------------------
  useEffect(() => {
    setHeaderToken(() => {
      axios.get(`${conf.url}/api/activities`)
        .then((result) => {
          setActivities(result.data);
        });
    });
    if (id) {
      setHeaderToken(() => {
        axios.get(`${conf.url}/api/events/${id}`)
          .then((result) => {
            setEvents(result.data);
            setId(id);
            setTitle(result.data[0].name_event);
            setDescribtion(result.data[0].description_event);
            setCapacite(result.data[0].capacity);
            setDateBegin(result.data[0].date_b);
            setDateEnd(result.data[0].date_e);
            setAddress(result.data[0].address_event);
            setSelectValue(result.data[0].activity_id > 2 ? 'default' : null);
            setIdActivity(result.data[0].activity_id > 2 ? 1 : 0);
            setFile(result.data[0].picture_event);
            setActive('active');
          });
      });
    }
    setRecharge(0);
    M.AutoInit();
  }, [recharge === 1]);

  // -----------------------------------------RENDU-------------------------------------------------
  return (
    <div className="container">
      {redirection ? <Redirect to="/" /> : ''}
      <h1 className="center-align marg">{!id ? "Création d'un evenement" : "Modification d'un evenement"}</h1>
      <div className="row">
        <div className="input-field col s12">
          {id ? (
            <p>
              Modification de l&apos;evenement :
              {events[0] ? events[0].name_event : ''}
            </p>
          ) : ''}
          {!id ? (
            <select value={indexSup} onChange={valueSelected} className="browser-default color_select">
              <option value="default">Choisir une activité</option>
              {activities ? activities.map((activity, index) => (
                <option style={activity.id_activity === 3 ? { display: 'none' } : null} value={index} key={activity.id_activity}>{activity.name}</option>
              )) : ''}
            </select>
          ) : ''}
        </div>
        <div className="input-field col s12">
          <i className="material-icons prefix">title</i>
          <input id="titre_activité" type="text" className="validate" value={title} onChange={e => handleChange(e, setTitle)} />
          <label className={active} htmlFor="titre_activité">Titre de l&apos;evenement</label>
        </div>
      </div>
      <div className="row">
        <div className="input-field col s12">
          <i className="material-icons prefix">description</i>
          <textarea id="description" className="materialize-textarea" value={describtion} onChange={e => handleChange(e, setDescribtion)} />
          <label className={active} htmlFor="description">Déscription de l&apos;evenement</label>
        </div>
      </div>
      <div className="row">
        <div className="file-field input-field col s12">
          <div className="btn">
            <span>Illustration</span>
            <input type="file" onChange={handleChangeFile} name="file" />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path" type="text" />
          </div>
        </div>
      </div>
      <div className="row center">
        <div className="input-field col s4">
          <span style={{ color: 'black', fontSize: '1.2em' }}>Date de début :</span>
          <i className="material-icons">calendar_today</i>
          <DatePicker
            showTimeSelect
            locale="fr"
            dateFormat="dd MMM yyyy, HH:mm"
            timeFormat="HH:mm"
            timeIntervals={30}
            timeCaption="time"
            selected={dateBegin && new Date(dateBegin)}
            onChange={date => date && setDateBegin(moment(date).format())}
          />
        </div>
        <div className="input-field col s4">
          <span style={{ color: 'black', fontSize: '1.2em' }}>Date de fin :</span>
          <i className="material-icons">calendar_today</i>
          <DatePicker
            showTimeSelect
            locale="fr"
            dateFormat="dd MMM yyyy, HH:mm"
            timeFormat="HH:mm"
            timeIntervals={30}
            timeCaption="time"
            selected={dateEnd && new Date(dateEnd)}
            onChange={date => date && setDateEnd(moment(date).format())}
          />
        </div>
        <div className="input-field col s4">
          <i className="material-icons prefix">supervisor_account</i>
          <textarea id="capacity" className="materialize-textarea" value={capacite} onChange={e => handleChange(e, setCapacite)} />
          <label className={active} htmlFor="capacity">Capacity</label>
        </div>
      </div>
      <div className="row">
        <div className="input-field col s12">
          <i className="material-icons prefix">add_location</i>
          <textarea id="address" className="materialize-textarea" value={address} onChange={e => handleChange(e, setAddress)} />
          <label className="active" htmlFor="address">Adresse</label>
        </div>
      </div>
      <div className="center-align marge">
        {!id ? <button className="btn waves-effect waves-light pos_bt" onClick={submitEvents} type="submit">Creer</button> : ''}
        {id ? <button className="btn waves-effect waves-light pos_bt" onClick={modifyEvents} type="submit">Modifier</button> : ''}
      </div>
      {(selectValue === 'default' || indexSup > 1) || idActivity === 1 ? (
        <div className="card horizontal">
          <div className="card-image">
            <img src={file} alt={title} />
          </div>
          <div className="card-stacked">
            <span className="card-title title">{title}</span>
            <div className="card-content">
              <p>{describtion}</p>
            </div>
            <div className="card-bottom">
              <p>
                Places restantes :
                {capacite}
              </p>
              <p>
                Date :
                {dateBegin !== '' ? moment(dateBegin).format('DD-MM-YYYY HH:mm:ss') : ''}
              </p>
              <p>
                Lieu :
                {address}
              </p>
            </div>
            <button
              type="button"
              className="card-button waves-effect waves-light btn-small teal darken-1 white-text col right"
            >
              RESERVER
            </button>
          </div>
        </div>
      ) : ''}
      {(selectValue !== 'default' && indexSup < 2) || idActivity === 0 ? (
        <div className="render">
          <div className="container mssg">
            <h1 className="center-align subtitles"><span>{title}</span></h1>
            <p className="justify text">{describtion}</p>
            <img className="activitie_pics" src={file} alt="cocotte_activite" />
          </div>
        </div>
      ) : ''}
      {(selectValue !== 'default' && indexSup < 2) || idActivity === 0 ? (
        <div>
          <ul className="collection">
            <li className="collection-item row center-align">
              <p className="col s3">{title}</p>
              <p className="col s3">
                Places restantes :
                {capacite}
              </p>
              <p className="col s3">
                Date :
                {dateBegin !== '' ? moment(dateBegin).format('DD-MM-YYYY HH:mm:ss') : ''}
              </p>
              <p className="col s3">
                <button
                  type="button"
                  className="waves-effect waves-light btn-small teal darken-1 white-text col right"
                >
                  RESERVER
                </button>
              </p>
            </li>
          </ul>
        </div>
      ) : ''}
    </div>
  );
}

export default Events;

Events.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};
