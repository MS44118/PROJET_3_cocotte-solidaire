import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css/dist/js/materialize';
import './Activities.css';

function Activities() {
  //-----------------------------------------------HOOKS-----------------------------------------------
  const [activities, setActivities] = useState([]);
  const [selectValue, setSelectValue] = useState('default');
  const [id, setId] = useState(null);
  const [title, setTitle] = useState('');
  const [describtion, setDescribtion] = useState('');
  const [file, setFile] = useState('');
  const [realFile, setRealFile] = useState(null);
  const [index, setIndex] = useState(null);
  const [nameFile, setNameFile] = useState('');
  const [active, setActive] = useState('');
  const [emptyFile, setEmptyFile] = useState(0);

  //-----------------------------------------CHANGEMENT STATE-------------------------------------------
  const handleChange = (event, setHook) => setHook(event.target.value);
  const handleChangeFile = (event) => {
    setEmptyFile(1);
    setFile(event.target.files[0] ? URL.createObjectURL(event.target.files[0]) : false);
    setRealFile(event.target.files[0] ? event.target.files[0] : null)
    setNameFile(event.target);
  };
  const valueSelected = (event) => {
    setIndex(event.target.value);
    setSelectValue(activities[event.target.value] ? activities[event.target.value] : 'default');
    setId(activities[event.target.value] ? activities[event.target.value].id_activity : null)
    setTitle(activities[event.target.value] ? activities[event.target.value].name : '');
    setDescribtion(activities[event.target.value] ? activities[event.target.value].description : '');
    setFile(activities[event.target.value] ? activities[event.target.value].picture : '');
    setActive(event.target.value === 'defaul' ? '' : 'active');
  };

  //-----------------------------------------------REQUETES-----------------------------------------------
  const submitActivity = () => {
    let file = nameFile;
    let fileName = `${title}-${new Date().getTime()}.jpg`;
    var blob = file.files[0].slice(0, file.files[0].size, 'image/jpg'); 
    let newFile = new File([blob], fileName, {type: 'image/jpg'});
    const data = new FormData();
    setRealFile(newFile)
    data.append('file', newFile)
    axios.post('http://localhost:8000/uploaddufichier/', data ,{
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
        console.log(error);
        alert(`${error}`)
    })
    axios.post('http://localhost:8000/activities/', {
      name: title,
      description: describtion,
      picture: `./images/${newFile.name}`
    })
    .then((response) => {
        console.log(response);
        alert(`Votre activité ${title} à ete cree`)
    })
    .catch((error) => {
        console.log(error);
        alert(`${error}`)
    })    
  };

  const modifyActivity = () => {
    let newFile
    if(emptyFile === 1) {
      let file1 = nameFile;
      let fileName = `${title}-${new Date().getTime()}.jpg`;
      var blob = file1.files[0].slice(0, file1.files[0].size, 'image/jpg');
      newFile = new File([blob], fileName, {type: 'image/jpg'});
      const data = new FormData();
      setRealFile(newFile)
      data.append('file', newFile)
      axios.post('http://localhost:8000/uploaddufichier/', data ,{
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
          console.log(error);
          alert(`${error}`)
      })
    }
    // const resPic = emptyFile === 1 ? activities[index].picture : `/images/${newFile.name}`
    axios.put(`http://localhost:8000/activities/${id}`, {
      name: title,
      description: describtion,
      picture: emptyFile === 1 ? `/images/${newFile.name}` : activities[index].picture
    })
    .then((response) => {
        console.log(response);
        alert(`Votre activité ${title} à ete modifiee`)
    })
    .catch((error) => {
        console.log(error);
        alert(`${error}`)
    })
  };

  const removeActivity = () => {
    axios.delete(`http://localhost:8000/activities/${id}`)
    .then((response) => {
        console.log(response);
        alert(`L'activite ${title} a ete supprimee`);
    })
    .catch((error) => {
        console.log(error);
        alert(`${error}`)
    })
  };

  //------------------------------------------------GET ACTIVITIES---------------------------------------------------
  useEffect(() => {
    axios.get('http://localhost:8000/activities')
      .then((result) => {
        setActivities(result.data);
      });
    M.AutoInit();
  }, []);

//------------------------------------------------------RENDU---------------------------------------------------------
  return (
    <div className="container">
      <h1>Création d&apos;une activité</h1>
      {/* <form> */}
        <div className="row">
          <div className="input-field col s6">
            <select onChange={valueSelected} className="browser-default color_select">
              <option value="default" selected>Création d&apos;une nouvelle activité</option>
              {activities ? activities.map((activity, index) => (
                <option value={index}>{activity.name}</option>
              )) : ''}
            </select>
          </div>
          <div className="input-field col s6">
            <i className="material-icons prefix">title</i>
            <input id="titre_activité" type="text" required className="validate" value={title} onChange={(e) => handleChange(e, setTitle)} />
            <label className={active} htmlFor="titre_activité">Titre de l&apos;activité</label>
          </div>
        </div>

        <div className="row">
          <div className="input-field col s12">
            <i className="material-icons prefix">description</i>
            <textarea id="description" required className="materialize-textarea" value={describtion} onChange={(e) => handleChange(e, setDescribtion)} />
            <label className={active} htmlFor="description">Déscription de l&apos;activité</label>
          </div>
        </div>

        <div className="row">
          <div className="file-field input-field">
            <div className="btn">
              <span>Illustration</span>
              <input type="file" onChange={handleChangeFile} name="file"/>
            </div>
            <div className="file-path-wrapper">
              <input className="file-path validate" type="text"  />
            </div>
          </div>
        </div>

        <form className="center-align">
          {selectValue === 'default' ? <button className="btn waves-effect waves-light pos_bt" onClick={submitActivity} type="submit">Creer</button> : ''}
          {selectValue !== 'default'  ? <button className="btn waves-effect waves-light pos_bt" onClick={modifyActivity} type="submit">Modifier</button> : ''}
          {selectValue !== 'default'  ? <button className="btn waves-effect waves-light pos_bt" onClick={removeActivity} type="submit">Supprimer</button> : ''}
        </form>

        <p className="center-align">Rendu de l&apos;activité</p>
        <div className="render">
          <div className="container mssg">
            <h1 className="center-align subtitles"><span>{title}</span></h1>
            <p className="justify text">{describtion}</p>
            {file ? <img className="activitie_pics" src={file} alt="cocotte_activite" /> : ''}
          </div>
        </div>
      {/* </form> */}
    </div>
  );
}

export default Activities;
