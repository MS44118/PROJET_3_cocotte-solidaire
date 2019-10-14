import { combineReducers } from 'redux';
import displayUserFormReducer from './displayUserFormReducer';
import userReducer from './userReducer';
import eventsReducer from './eventsReducer';
import registrationsReducer from './registrationsReducer';
import tokenReducer from './tokenReducer';

const rootReducer = combineReducers({
  displayUserForm: displayUserFormReducer,
  user: userReducer,
  events: eventsReducer,
  registrations: registrationsReducer,
  token: tokenReducer,
});

export default rootReducer;
