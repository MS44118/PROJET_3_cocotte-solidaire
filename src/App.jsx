import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { message } from 'antd';
import PropTypes from 'prop-types';
import axios from 'axios';
import Menu from './Components/Menu/Menu';
import Activities from './Components/Activities/Activities';
import Events from './Components/Events/Events';
import Reservation from './Components/Reservation/Reservation';
import Users from './Components/Users/Users';
import EventHome from './Components/EventHome/EventHome';
import Footer from './Components/Footer/Footer';
import Login from './Components/Login/Login';
import SignUp from './Components/SignUp/SignUp';
import setHeaderToken from './Utils/tokenUtil';
import conf from './app.conf';

import { tokenApprovedTrueAction } from './Actions/tokenAction';

function App({ tokenApproved, dispatch }) {
  useEffect(() => {
    setHeaderToken(() => {
      axios.post(`${conf.url}/api/auth`)
        .then((res) => {
          if (res.status === 200) {
            dispatch(tokenApprovedTrueAction());
          } else {
            localStorage.removeItem('id_token');
          }
        })
        .catch(() => {
          message.error('Votre session a expiré, merci de vous authentifier à nouveau', 3);
        });
    });
  }, []);

  return (
    <div>
      {tokenApproved ? (
        <div>
          <Menu />
          <Route path="/" exact component={EventHome} />
          <Route path="/events" exact component={Events} />
          <Route path="/events/:id" exact component={Events} />
          <Route path="/activities" exact component={Activities} />
          <Route path="/reservation" exact component={Reservation} />
          <Route path="/users" exact component={Users} />
          <Route path="/signup" exact component={SignUp} />
          <Footer />
        </div>
      )
        : (
          <div>
            <Login />
            {/* <SignUp/> */}
          </div>
        )}
    </div>
  );
}

const mapStateToProps = store => ({
  tokenApproved: store.token,
});

App.propTypes = {
  tokenApproved: PropTypes.bool,
  dispatch: PropTypes.func,
};

App.defaultProps = {
  tokenApproved: null,
  dispatch: null,
};

export default connect(mapStateToProps)(App);
