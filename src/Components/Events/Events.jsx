import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css/dist/js/materialize';
import './Events.css';

function Events() {
  const [activities, setActivities] = useState([]);
  const [title, setTitle] = useState('');
  const [describtion, setDescribtion] = useState('');
  // const [date, setDate] = useState('');
  const [dateBegin, setDateBegin] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  // const [capacity, setCapacity] = useState('');
  const [address, setAddress] = useState('');
  const [ville, setVille] = useState('');

  const handleChangeTitle = (event) => {
    setTitle(event.target.value);
  };
  const handleChangeDescribtion = (event) => {
    setDescribtion(event.target.value);
  };
  const handleChangeDateBegin = (event) => {
    setDateBegin(event.target.value);
  };
  const handleChangeDateEnd = (event) => {
    setDateEnd(event.target.value);
  };
  const handleChangeAddress = (event) => {
    setAddress(event.target.value);
  };
  const handleChangeVille = (event) => {
    setVille(event.target.value);
  };

  useEffect(() => {
    axios.get('http://localhost:8000/activities')
      .then((result) => {
        setActivities(result.data);
      });
    M.AutoInit();
  }, []);

  return (
    <div className="container">
      <h1>Création d&apos;un evenement</h1>
      <form className="" action="#">
        <div className="row">
          <div className="input-field col s6">
            {/* <i className="material-icons prefix">title</i> */}
            <select className="browser-default">
              <option value="" disabled selected>Choisir une activité</option>
              {activities.map((activity, index) => (
                <option value={index}>{activity.name}</option>
              ))}
            </select>
          </div>
          <div className="input-field col s6">
            <i className="material-icons prefix">title</i>
            <input id="titre_activité" type="text" className="validate" value={title} onChange={handleChangeTitle} />
            <label htmlFor="titre_activité">Titre de l&apos;evenement</label>
          </div>
        </div>

        <div className="row">
          <div className="input-field col s12">
            <i className="material-icons prefix">description</i>
            <textarea id="description" className="materialize-textarea" value={describtion} onChange={handleChangeDescribtion} />
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

        {/* <Calendar className="row center-align" /> */}

        <div className="row">
          <div className="input-field col s4">
            <i className="material-icons prefix">calendar_today</i>
            <input type="text" className="datepicker" />
          </div>
          <div className="input-field col s4">
            <i className="material-icons prefix">timer</i>
            <textarea id="date_begin" className="materialize-textarea" value={dateBegin} onChange={handleChangeDateBegin} />
            <label htmlFor="date_begin">Heure du debut</label>
          </div>
          <div className="input-field col s4">
            <i className="material-icons prefix">timer_off</i>
            <textarea id="date_end" className="materialize-textarea" value={dateEnd} onChange={handleChangeDateEnd} />
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
            <textarea id="address" className="materialize-textarea" value={address} onChange={handleChangeAddress} />
            <label htmlFor="address">Adresse</label>
          </div>
          <div className="input-field col s6">
            <i className="material-icons prefix">location_city</i>
            <textarea id="ville" className="materialize-textarea" value={ville} onChange={handleChangeVille} />
            <label htmlFor="ville">Ville</label>
          </div>
        </div>

        <div className="center-align">
          <button className="btn waves-effect waves-light pos_bt" type="submit" name="action">Créer</button>
          <button className="btn waves-effect waves-light pos_bt" type="submit" name="action">Supprimer</button>
        </div>

        {/* <p className="center-align">Rendu de l'activité</p>
        <div className="render">
          <div className="container">
            <h1 className="center-align subtitles"><span>{title}</span></h1>
            <p className="justify text">{describtion}</p>
            <img className="activitie_pics" src="https://therapeutesmagazine.com/wp-content/uploads/2016/09/mythes-yoga.jpg" alt="cocotte_activite"></img>
          </div>
        </div> */}

        {/* <div className="center-align"><button className="btn waves-effect
       waves-light pos_bt" type="submit" name="action">Créer</button></div> */}
        {/* <button className="btn waves-effect waves-light" type="submit"
         name="action">Modifier</button>
        <button className="btn waves-effect waves-light" type="submit"
         name="action">Supprimer</button> */}

      </form>
    </div>
  );
}

export default Events;
