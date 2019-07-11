import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css/dist/js/materialize';
import conf from '../../app.conf';
import './Activities.css';

function Activities() {
  // ----------------------------------HOOKS----------------------------------
  const [activities, setActivities] = useState([]);
  const [selectValue, setSelectValue] = useState('default');
  const [id, setId] = useState(null);
  const [title, setTitle] = useState('');
  const [describtion, setDescribtion] = useState('');
  const [file, setFile] = useState('');
  const [indexSup, setIndexSup] = useState('default');
  const [nameFile, setNameFile] = useState('');
  const [active, setActive] = useState('');
  const [emptyFile, setEmptyFile] = useState(0);
  const [recharge, setRecharge] = useState(0);

  // --------------------------------CHANGEMENT STATE-----------------------------------
  const handleChange = (event, setHook) => setHook(event.target.value.replace('/', ''));
  const handleChangeFile = (event) => {
    setEmptyFile(1);
    setFile(event.target.files[0] ? URL.createObjectURL(event.target.files[0]) : false);
    setNameFile(event.target);
  };
  const valueSelected = (event) => {
    setIndexSup(event.target.value);
    setSelectValue(activities[event.target.value] ? activities[event.target.value] : 'default');
    setId(activities[event.target.value] ? activities[event.target.value].id_activity : null);
    setTitle(activities[event.target.value] ? activities[event.target.value].name : '');
    setDescribtion(activities[event.target.value] ? activities[event.target.value].description : '');
    setFile(activities[event.target.value] ? activities[event.target.value].picture : '');
    setActive(event.target.value === 'defaul' ? '' : 'active');
  };

  // -----------------------------------------------REQUETES-------------------------------
  const submitActivity = () => {
    const file1 = nameFile;
    const fileName = `activite-${title}.jpg`;
    const blob = file1.files[0].slice(0, file1.files[0].size, 'image/jpg');
    const newFile = new File([blob], fileName, { type: 'image/jpg' });
    const data = new FormData();
    data.append('file', newFile);
    axios.post(`${conf.url}/activities/`, {
      name: title,
      description: describtion,
      picture: `./images/${newFile.name}`,
    })
      .then((response) => {
        toast.info(response);
        toast.info('Activité crée !');
      })
      .catch((error) => {
        toast.info(error);
        // toast.info(`${error}`);
      });
    axios.post(`${conf.url}/uploaddufichier/`, data)
      .then((response) => {
        toast.info(response);
        toast.info('Activité crée !');
      })
      .catch((error) => {
        toast.info(error);
        // toast.info(`${error}`);
      });
    setTitle('');
    setDescribtion('');
    setFile('');
    setNameFile('');
    setSelectValue('default');
    setIndexSup('default');
    setEmptyFile(0);
    setRecharge(1);
  };

  const modifyActivity = () => {
    let newFile;
    if (emptyFile === 1) {
      const file1 = nameFile;
      const fileName = `activite-${title}.jpg`;
      const blob = file1.files[0].slice(0, file1.files[0].size, 'image/jpg');
      newFile = new File([blob], fileName, { type: 'image/jpg' });
      const data = new FormData();
      data.append('file', newFile);
      axios.post(`${conf.url}/uploaddufichier/`, data, {
      })
        .then((response) => {
          toast.info(response);
          toast.info(`Votre activité ${title} à ete modifiee`);
        })
        .catch((error) => {
          toast.info(error);
          // toast.info(`${error}`);
        });
    }
    axios.put(`${conf.url}/activities/${id}`, {
      name: title,
      description: describtion,
      picture: emptyFile === 1 ? `/images/${newFile.name}` : activities[indexSup].picture,
    })
      .then((response) => {
        toast.info(response);
        toast.info(`Votre activité ${title} à ete modifiee`);
      })
      .catch((error) => {
        toast.info(error);
        // toast.info(`${error}`);
      });
    setTitle('');
    setDescribtion('');
    setFile('');
    setNameFile('');
    setSelectValue('default');
    setIndexSup('default');
    setRecharge(1);
    setEmptyFile(0);
  };

  const removeActivity = () => {
    const sendFile = file.split('/');
    axios.delete(`${conf.url}/activities/${id}`)
      .then((response) => {
        toast.info(response);
        toast.info(`L'activite ${title} a ete supprimee`);
      })
      .catch((error) => {
        toast.info(error.data);
        // toast.info(`${error}`);
      });
    axios.delete(`${conf.url}/deletefile/${sendFile[2]}`)
      .then((response) => {
        toast.info(response);
        toast.info(`L'activite ${title} a ete supprimee`);
      })
      .catch((error) => {
        toast.info(error);
        // toast.info(`${error}`);
      });
    setTitle('');
    setDescribtion('');
    setFile('');
    setNameFile('');
    setSelectValue('default');
    setIndexSup('default');
    setRecharge(1);
    setEmptyFile(0);
  };

  const prevent = (e) => {
    e.preventDefault();
  };

  // ------------------------------------------------GET ACTIVITIES------------------------
  useEffect(() => {
    axios.get(`${conf.url}/activities`)
      .then((result) => {
        setActivities(result.data);
      });
    M.AutoInit();
    setRecharge(0);
  }, [recharge === 1]);

  // ------------------------------------------------------RENDU------------------------------
  return (
    <div className="container">
      <ToastContainer
        autoClose={6000}
        position="top-center"
      />
      <h1 className="center-align marg">Création d&apos;une activité</h1>
      <div className="row">
        <div className="input-field col s6">
          <select value={indexSup} onChange={valueSelected} className="browser-default color_select">
            <option value="default">Création d&apos;une nouvelle activité</option>
            {activities ? activities.map((activity, index) => (
              <option style={activity.id_activity === 3 ? { display: 'none' } : null} value={index} key={activity.id_activity}>{activity.name}</option>
            )) : ''}
          </select>
        </div>
        <div className="input-field col s6">
          <i className="material-icons prefix">title</i>
          <input id="titre_activité" type="text" value={title} onChange={e => handleChange(e, setTitle)} />
          <label className={active} htmlFor="titre_activité">Titre de l&apos;activité</label>
        </div>
      </div>

      <div className="row">
        <div className="input-field col s12">
          <i className="material-icons prefix">description</i>
          <textarea id="description" className="materialize-textarea" value={describtion} onChange={e => handleChange(e, setDescribtion)} />
          <label className={active} htmlFor="description">Déscription de l&apos;activité</label>
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

      <div className="center-align">
        {selectValue === 'default' ? (
          <button
            className="btn waves-effect waves-light pos_bt"
            onClick={title !== '' && describtion !== '' && file !== '' ? submitActivity : prevent}
            type="submit"
          >
            Creer
          </button>
        ) : ''}
        {selectValue !== 'default' ? (
          <button
            className="btn waves-effect waves-light pos_bt"
            onClick={title !== '' && describtion !== '' ? modifyActivity : prevent}
            type="submit"
          >
            Modifier
          </button>
        ) : ''}
        {selectValue !== 'default' ? (
          <button
            className="btn waves-effect waves-light pos_bt"
            onClick={removeActivity}
            type="submit"
          >
            Supprimer
          </button>
        ) : ''}
      </div>

      <p className="center-align renduSize">Rendu de l&apos;activité</p>
      <div className="render container mssg">
        <h1 className="center-align subtitles"><span>{title}</span></h1>
        <p className="justify text">{describtion}</p>
        {file ? <img className="activitie_pics" src={file} alt="cocotte_activite" /> : ''}
      </div>
    </div>
  );
}

export default Activities;
