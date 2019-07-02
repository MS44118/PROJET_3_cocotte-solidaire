import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css/dist/js/materialize';
import './Activities.css';

function Activities() {
// -----------------------------------------------HOOKS---------------------------------
  const [activities, setActivities] = useState([]);
  const [selectValue, setSelectValue] = useState('default');
  const [id, setId] = useState(null);
  const [title, setTitle] = useState('');
  const [describtion, setDescribtion] = useState('');
  const [file, setFile] = useState('');
  const [indexSup, setIndexSup] = useState(null);
  const [nameFile, setNameFile] = useState('');
  const [active, setActive] = useState('');
  const [emptyFile, setEmptyFile] = useState(0);
  const [recharge, setRecharge] = useState(0);

  // --------------------------------CHANGEMENT STATE-----------------------------------
  const handleChange = (event, setHook) => setHook(event.target.value);
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
    const fileName = `${title}.jpg`;
    const blob = file1.files[0].slice(0, file1.files[0].size, 'image/jpg');
    const newFile = new File([blob], fileName, { type: 'image/jpg' });
    const data = new FormData();
    data.append('file', newFile);
    axios.post('http://localhost:8000/activities/', {
      name: title,
      description: describtion,
      picture: `./images/${newFile.name}`,
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
    axios.post('http://localhost:8000/uploaddufichier/', data)
      .then((response) => {
        console.log(response);
        toast.info('Activité crée !');
      })
      .catch((error) => {
        console.log(error);
        toast.info(`${error}`);
      });
    setTitle('');
    setDescribtion('');
    setFile('');
    setNameFile('');
    setSelectValue('default');
    setEmptyFile(0);
    setRecharge(1);
  };

  const modifyActivity = () => {
    let newFile;
    if (emptyFile === 1) {
      const file1 = nameFile;
      const fileName = `${title}.jpg`;
      const blob = file1.files[0].slice(0, file1.files[0].size, 'image/jpg');
      newFile = new File([blob], fileName, { type: 'image/jpg' });
      const data = new FormData();
      data.append('file', newFile);
      axios.post('http://localhost:8000/uploaddufichier/', data, {
      })
        .then((response) => {
          console.log(response);
          toast.info(`Votre activité ${title} à ete modifiee`);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    axios.put(`http://localhost:8000/activities/${id}`, {
      name: title,
      description: describtion,
      picture: emptyFile === 1 ? `/images/${newFile.name}` : activities[indexSup].picture,
    })
      .then((response) => {
        console.log(response);
        toast.info(`Votre activité ${title} à ete modifiee`);
      })
      .catch((error) => {
        console.log(error);
        toast.info(`${error}`);
      });
    setTitle('');
    setDescribtion('');
    setFile('');
    setNameFile('');
    setSelectValue('default');
    setRecharge(1);
    setEmptyFile(0);
  };

  const removeActivity = () => {
    const sendFile = file.split('/');
    axios.delete(`http://localhost:8000/activities/${id}`)
      .then((response) => {
        console.log(response);
        toast.info(`L'activite ${title} a ete supprimee`);
      })
      .catch((error) => {
        console.log(error);
      });
    axios.post(`http://localhost:8000/deletefile/${sendFile[2]}`)
      .then((response) => {
        console.log(response);
        toast.info(`L'activite ${title} a ete supprimee`);
      })
      .catch((error) => {
        console.log(error);
        toast.info(`${error}`);
      });
    setTitle('');
    setDescribtion('');
    setFile('');
    setNameFile('');
    setSelectValue('default');
    setRecharge(1);
    setEmptyFile(0);
  };

  const prevent = (e) => {
    e.preventDefault();
  };

  // ------------------------------------------------GET ACTIVITIES------------------------
  useEffect(() => {
    axios.get('http://localhost:8000/activities')
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
          <select onChange={valueSelected} className="browser-default color_select">
            <option defaultValue>Création d&apos;une nouvelle activité</option>
            {activities ? activities.map((activity, index) => (
              <option value={index}>{activity.name}</option>
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
            <input className="file-path" type="text" value={nameFile} />
          </div>
        </div>
      </div>

      <div className="center-align">
        {selectValue === 'default' ? <button className="btn waves-effect waves-light pos_bt" onClick={title !== '' && describtion !== '' && file !== '' ? submitActivity : prevent} type={title !== '' && describtion !== '' ? 'submit' : ''}>Creer</button> : ''}
        {selectValue !== 'default' ? <button className="btn waves-effect waves-light pos_bt" onClick={title !== '' && describtion !== '' ? modifyActivity : prevent} type={title !== '' && describtion !== '' ? 'submit' : ''}>Modifier</button> : ''}
        {selectValue !== 'default' ? <button className="btn waves-effect waves-light pos_bt" onClick={removeActivity} type="submit">Supprimer</button> : ''}
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
