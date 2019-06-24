import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css/dist/js/materialize';
import './Events.css';

function Events() {
  // ----------------------------HOOKS--------------------------
  const [activities, setActivities] = useState([]);
  const [selectValue, setSelectValue] = useState('default');
  const [eventId, setEventId] = useState(null);
  const [activityId, setActivityId] = useState(null);
  const [title, setTitle] = useState('');
  const [describtion, setDescribtion] = useState('');
  const [date, setDate] = useState('');
  const [dateBegin, setDateBegin] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [capacity, setCapacity] = useState('');
  const [address, setAddress] = useState('');
  const [ville, setVille] = useState('');
  const [file, setFile] = useState('');
  const [realFile, setRealFile] = useState(null);
  const [nameFile, setNameFile] = useState('');
  const [active, setActive] = useState('');

  // ----------------------------CHANGEMENT STATE--------------------------
  const handleChange = (event, setHook) => setHook(event.target.value);

  // ----------------------------REQUETES--------------------------


  // ----------------------------GET EVENTS--------------------------
  useEffect(() => {
    axios.get('http://localhost:8000/activities')
      .then((result) => {
        setActivities(result.data);
      });
    M.AutoInit();
  }, []);

  // ------------------------------RENDU----------------------------
  return (
    <div className="container">
      <h1>Création d&apos;un evenement</h1>
      {/* <form className="" action="#"> */}
      <div className="row">
        <div className="input-field col s6">
          <select className="browser-default">
            <option value="" disabled selected>Choisir une activité</option>
            {activities.map((activity, index) => (
              <option value={index}>{activity.name}</option>
            ))}
          </select>
        </div>
        <div className="input-field col s6">
          <i className="material-icons prefix">title</i>
          <input id="titre_activité" type="text" className="validate" value={title} onChange={e => handleChange(e, setTitle)} />
          <label htmlFor="titre_activité">Titre de l&apos;evenement</label>
        </div>
      </div>

      <div className="row">
        <div className="input-field col s12">
          <i className="material-icons prefix">description</i>
          <textarea id="description" className="materialize-textarea" value={describtion} onChange={e => handleChange(e, setDescribtion)} />
          <label htmlFor="description">Déscription de l&apos;evenement</label>
        </div>
      </div>

      <div className="row">
        <div className="file-field input-field">
          <div className="btn">
            <span>Illustration</span>
            <input type="file" />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="input-field col s4">
          <i className="material-icons prefix">calendar_today</i>
          <input type="text" className="datepicker" />
        </div>
        <div className="input-field col s4">
          <i className="material-icons prefix">timer</i>
          <textarea id="date_begin" className="materialize-textarea" value={dateBegin} onChange={e => handleChange(e, setDateBegin)} />
          <label htmlFor="date_begin">Heure du debut</label>
        </div>
        <div className="input-field col s4">
          <i className="material-icons prefix">timer_off</i>
          <textarea id="date_end" className="materialize-textarea" value={dateEnd} onChange={e => handleChange(e, setDateEnd)} />
          <label htmlFor="date_end">Heure de fin</label>
        </div>
      </div>

      <div className="row">
        <div className="input-field col s12">
          <i className="material-icons prefix">supervisor_account</i>
          <select multiple>
            <option value="" disabled>Capacity</option>
            <option value="adult_1">1</option>
          </select>
        </div>
      </div>

      <div className="row">
        <div className="input-field col s6">
          <i className="material-icons prefix">add_location</i>
          <textarea id="address" className="materialize-textarea" value={address} onChange={e => handleChange(e, setAddress)} />
          <label htmlFor="address">Adresse</label>
        </div>
        <div className="input-field col s6">
          <i className="material-icons prefix">location_city</i>
          <textarea id="ville" className="materialize-textarea" value={ville} onChange={e => handleChange(e, setVille)} />
          <label htmlFor="ville">Ville</label>
        </div>
      </div>

      <div className="center-align">
        <button className="btn waves-effect waves-light pos_bt" type="submit" name="action">Créer</button>
        <button className="btn waves-effect waves-light pos_bt" type="submit" name="action">Supprimer</button>
      </div>

      {/* </form> */}

    </div>
  );
}

export default Events;
