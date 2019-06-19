import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css/dist/js/materialize';
import './Activities.css';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [title, setTitle] = useState('');
  const [describtion, setDescribtion] = useState('');
  const [file, setFile] = useState('');

  const handleChangeTitle = (event) => {
    setTitle(event.target.value);
  };

  const handleChangeDescribtion = (event) => {
    setDescribtion(event.target.value);
  };

  useEffect(() => {
    axios.get('http://localhost:8000/activities')
      .then((result) => {
        setActivities(result.data);
      });
    M.AutoInit();
  }, []);

  const handleChangeFile = (event) => {
    setFile(URL.createObjectURL(event.target.files[0]));
  };

  return (
    <div className="container">
      <h1>Création d&apos;une activité</h1>
      <form className="" action="#">
        <div className="row">
          <div className="input-field col s6">
            {/* <i className="material-icons prefix">title</i> */}
            <select className="browser-default">
              <option value="" disabled selected>Choisir une activité</option>
              {activities ? activities.map((activity, index) => (
                <option value={`${index + 1}`}>{activity.name}</option>
              )) : ''}
            </select>
          </div>
          <div className="input-field col s6">
            <i className="material-icons prefix">title</i>
            <input id="titre_activité" type="text" className="validate" value={title} onChange={handleChangeTitle} />
            <label htmlFor="titre_activité">Titre de l&apos;activité</label>
          </div>
        </div>

        <div className="row">
          <div className="input-field col s12">
            <i className="material-icons prefix">description</i>
            <textarea id="description" className="materialize-textarea" value={describtion} onChange={handleChangeDescribtion} />
            <label htmlFor="description">Déscription de l&apos;activité</label>
          </div>
        </div>

        <div className="row">
          <div className="file-field input-field">
            <div className="btn">
              <span>Illustration</span>
              <input type="file" onChange={handleChangeFile} />
            </div>
            <div className="file-path-wrapper">
              <input className="file-path validate" type="text" />
            </div>
          </div>
        </div>

        <div className="center-align">
          <button className="btn waves-effect waves-light pos_bt" type="submit" name="action">Créer</button>
          <button className="btn waves-effect waves-light pos_bt" type="submit" name="action">Supprimer</button>
        </div>

        <p className="center-align">Rendu de l&apos;activité</p>
        <div className="render">
          <div className="container mssg">
            <h1 className="center-align subtitles"><span>{title}</span></h1>
            <p className="justify text">{describtion}</p>
            <img className="activitie_pics" src={`${file}`} alt="cocotte_activite" />
          </div>
        </div>

        {/* <div className="center-align">
              <button className="btn waves-effect waves-light pos_bt"
              type="submit" name="action">Créer</button>
            </div> */}
        {/* <button className="btn waves-effect waves-light"
        type="submit" name="action">Modifier</button>
            <button className="btn waves-effect waves-light"
            type="submit" name="action">Supprimer</button> */}

      </form>
    </div>
  );
}

export default Activities;
