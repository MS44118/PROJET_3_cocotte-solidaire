import React, { useEffect, useState } from 'react';
import axios from'axios';
import M from 'materialize-css/dist/js/materialize';
import 'materialize-css/dist/css/materialize.min.css';
import './Reservation.css';


function Reservation() {

   const [activities, setActivities] = useState([]);
   const [activitySelect, setActivitySelect] = useState(0);
   const [users , setUsers] = useState ([]);
   const [userSelect, setUserSelect] = useState();
   const [firstname, setFirstname] = useState (0) ;
   const [newReservationName, setNewReservationName]=useState('');
   const [newReservationLastName, setNewReservationLastName]=useState('');
   const [newReservationUserId, setNewReservationUserId]=useState('');
   const [numberAdultReservation, setnumberAdultReservation]=useState('');
   const [numberchildrenReservation, setnumbeChildrenRegistration]=useState('');
   const [newReservationMail, setNewReservationMail]=useState('');
   const [reservationAllergie, setReservationAllergie]=useState('');
   const [reservationInfo, setReservationInfo]=useState('');
   const [phoneNumber, setPhoneNumber]=useState('')
   const [activitiesReservation, setActivitiesreservation]=useState('')
   const [newActivities, setNewActivities]=useState('')

    useEffect(()=>{
      M.AutoInit();

      axios.get("http://localhost:8000/users")
      .then((result)=>{
        console.log(result.data)
        setUsers(result.data)
      })
      axios.get("http://localhost:8000/activities")
      .then((result)=>{
        console.log(result)
        setActivities(result.data)
      })

    },[]);
    
    
    const addReservation = {
      reservationAllergie,
      reservationInfo,
      activitiesReservation
      
    }

    const newUserRegistration = {
      numberAdultReservation,
      numberchildrenReservation,
      newReservationName,
      newReservationUserId,
      newReservationLastName,
      newReservationMail,
      phoneNumber

    }
    
    // const newUser= () =>{
    //   console.log(newUserRegistration)
    //   // axios.post("http://localhost:8000/registrations", newReservationName)
    // }
    // const newReservation = ()=> {
    //   console.log(addReservation)
    // }
    const sendForm= ()=>{
     console.log(addReservation,newUserRegistration)
    }

  return (

    <div className="container">
      <h1>Réservation</h1>
      <div className="row">
        <div className="input-field  col s8">
       
          <select id="activity" className="browser-default" onChange={(event)=>{
            setActivitySelect(event.target.value);
            setActivitiesreservation(event.target.value)

          }} value={activitySelect}>
          {activities.map((activity, index)=>
              <option value={index}>{activity.name}</option> 
              )}

          </select>


        </div>
        <div className="input-field col s4 mr-8">
          <button
            type="submit"
            className="waves-effect waves-light btn-small teal white-text right "
            onClick={sendForm}
          >
              Envoyer
          </button>
        </div>
      </div>
      <div className="row">
        <div className="input-field col s6">
          <i className="material-icons prefix">event_busy</i>
          <input id="event_name" type="text" className="validate" value={activities[activitySelect]&& activities[activitySelect].name} />
          <label htmlFor="event_name">Nom de l&apos;évènement</label>
        </div>

        <div className="input-field col s6">
          <i className="material-icons prefix">calendar_today</i>
          <input type="text" className="datepicker" />
        </div>

      </div>
      <div className=" row ">
        <div className="col s4 txt ">
          <p>Places à réserver</p>
        </div>
        <div className="input-field col s4">
          <select  onChange={(e)=> setnumberAdultReservation(e.target.value)}>
            <option value="" disabled selected>Nombre Adultes</option>
            <option value='1'>1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>

        </div>
        <div className="input-field col s4">
          <select onChange={(e)=>setnumbeChildrenRegistration(e.target.value)}>
            <option value="" disabled selected>Nombres Enfants</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>


        </div>
        <div className="input-field  col s8">
         <select className="browser-default" id="activity"
         onChange={(event)=>{setUserSelect(event.target.value)}} value={userSelect}
         
         >
            {users.map((user, index)=>
              <option value={index}>{user.firstname} {user.lastname}</option> 
              )}
          </select>
          </div>

      </div>
      {/* choose event collaps bar */}
      <div className="row">
      
          <div className="input-field col s6">
            <i className="material-icons prefix">account_circle</i>
            <input id="last_name" type="text" className="validate"
             onChange={(e)=>setNewReservationName(e.target.value)} 
             value={users[userSelect] && users[userSelect].firstname }
             />
            <label id="last_name" htmlFor="last_name">
            Nom
            </label>
        </div>
        <div  className="row">
          <div className="input-field col s6">
            <i className="material-icons prefix">account_circle</i>
            <input type="text" id="lastName" className="validate" 
            onChange={(e)=>setNewReservationLastName(e.target.value)} 
            value={users[userSelect]&& users[userSelect].lastname}/>
            <label htmlFor="lastNake">Prénom</label>
          </div>
          </div>
        </div>


        {/* row name mail and tel */}
        <div className="row">
          <div className="input-field col s6">
            <i className="material-icons prefix">email</i>
            <input id="email" type="email" className="validate" 
            onChange={(e)=>setNewReservationMail(e.target.value)}
            value={users[userSelect]&& users[userSelect].email} />
            <label htmlFor="email">
              Email
            </label>
          </div>

          <div className="input-field col s6">
            <i className="material-icons prefix">phone</i>
            <input id="icon_telephone" type="tel" className="validate"
            onchange={(e)=>setPhoneNumber(e.target.value)}
            value={users[userSelect]&& users[userSelect].phone} />
            <label htmlFor="icon_telephone">
              Téléphone
            </label>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s6">
            <i className="material-icons prefix">person_add</i>
            <input id="num_user" type="text" className="validate"
             onChange={(e)=>setNewReservationUserId(e.target.value)}  
             value={users[userSelect]&& users[userSelect].member_id} />
            <label htmlFor="num_user">
              Numéros d&apos;adhérent
            </label>
          </div>
        </div>
  
      
      
      <div className="row">
        <div className="input-field col s12">
          <i className="material-icons prefix">notification_important</i>
          <textarea 
          id="allergy" className="materialize-textarea" 
          onChange={(e)=> setReservationAllergie(e.target.value)}
          
          />
          <label htmlFor="allergy">
            Allergies
          </label>
        </div>
      </div>
      
      <div className="row">
        <div className="input-field col s12">
          <i className="material-icons prefix">info</i> 
          <input type='text' id="importantInfo" 
          className="validate"
           data-length="100%"
          onChange={(e)=>setReservationInfo(e.target.value)}/>
          <label htmlFor="importantInfo">
            Informations complémentaires
          </label>
        </div>
      </div>
    </div>
      

    

  );
}

export default Reservation;
