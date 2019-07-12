import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { message, Modal } from 'antd';
import M from 'materialize-css/dist/js/materialize';
import setHeaderToken from '../../Utils/tokenUtil';
import './Activities.css';

function Activities() {
  // ----------------------------------HOOKS----------------------------------
  const { confirm } = Modal;
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
    setHeaderToken(() => {
      axios.post('http://localhost:8000/api/activities/', {
        name: title,
        description: describtion,
        picture: `/images/${newFile.name}`,
      })
        .then(() => {
          message.success('Activité crée !', 3);
        })
        .catch(() => {
          message.error("L'actvité n'a pas été crée", 3);
        });
      axios.post('http://localhost:8000/api/uploaddufichier/', data)
        .then(() => {
          message.success('Activité crée !', 3);
        })
        .catch(() => {
          message.error("L'actvité n'a pas été crée", 3);
        });
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
      setHeaderToken(() => {
        axios.post('http://localhost:8000/api/uploaddufichier/', data, {
        })
          .then(() => {
            message.success(`Votre activité ${title} à été modifiée`, 3);
          })
          .catch(() => {
            message.error("L'actvité n'a pas été modifiée", 3);
          });
      });
    }
    setHeaderToken(() => {
      axios.put(`http://localhost:8000/api/activities/${id}`, {
        name: title,
        description: describtion,
        picture: emptyFile === 1 ? `/images/${newFile.name}` : activities[indexSup].picture,
      })
        .then(() => {
          message.success(`Votre activité ${title} à été modifiée`, 3);
        })
        .catch(() => {
          message.error("L'actvité n'a pas été modifiée", 3);
        });
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
    confirm({
      title: `Etes vous sur de vouloir supprimer l'activité: ${title} ?`,
      okText: 'Oui',
      okType: 'danger',
      cancelText: 'Non',
      onOk() {
        const sendFile = file.split('/');
        setHeaderToken(() => {
          axios.delete(`http://localhost:8000/api/activities/${id}`)
            .then(() => {
              message.success(`L'activité ${title} à été supprimée`, 3);
              axios.delete(`http://localhost:8000/api/deletefile/${sendFile[2]}`)
                .then(() => {
                  message.success(`L'activité ${title} à été supprimée`, 3);
                })
                .catch(() => {
                  message.error("L'actvité n'a pas été supprimée", 3);
                });
            })
            .catch((error) => {
              const getErr = `${error}`.split(' ');
              if (getErr[getErr.length - 1] === '503') {
                message.error('Des évenements sont liées à cette activité, vous ne pouvez pas la supprimer.', 3);
              } else {
                message.error("L'actvité n'a pas été supprimée", 3);
              }
            });
        });
        setTitle('');
        setDescribtion('');
        setFile('');
        setNameFile('');
        setSelectValue('default');
        setIndexSup('default');
        setRecharge(1);
        setEmptyFile(0);
      },
      onCancel() {
      },
    });
  };

  const prevent = (e) => {
    e.preventDefault();
  };

  // ------------------------------------------------GET ACTIVITIES------------------------
  useEffect(() => {
    setHeaderToken(() => {
      axios.get('http://localhost:8000/api/activities')
        .then((result) => {
          setActivities(result.data);
        });
    });
    M.AutoInit();
    setRecharge(0);
  }, [recharge === 1]);

  // ------------------------------------------------------RENDU------------------------------
  return (
    <div className="container">
      <h1 className="center-align marg">Création d&apos;une activité</h1>
      <div className="row">
        <div className="input-field col s12">
          <select value={indexSup} onChange={valueSelected} className="browser-default color_select">
            <option value="default">Création d&apos;une nouvelle activité</option>
            {activities ? activities.map((activity, index) => (
              <option style={activity.id_activity === 3 ? { display: 'none' } : null} value={index} key={activity.id_activity}>{activity.name}</option>
            )) : ''}
          </select>
        </div>
        <div className="input-field col s12">
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
