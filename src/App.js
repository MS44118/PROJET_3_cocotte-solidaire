import React from 'react';
import { Route } from 'react-router-dom';
import Menu from './Components/Menu/Menu';
import Activities from './Components/Activities/Activities';
import Events from './Components/Events/Events';
import Reservation from './Components/Reservation/Reservation';
import Users from './Components/Users/Users';
import Home from './Components/Home/Home';

function App() {
  return (
    <div>
      <Menu />
      <Route path="/" exact component={Home} />
      <Route path="/events" exact component={Events} />
      <Route path="/activities" exact component={Activities} />
      <Route path="/reservation" exact component={Reservation} />
      <Route path="/users" exact component={Users} />
    </div>
  );
}

export default App;
