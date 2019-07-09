import { combineReducers } from 'redux';
import displayUserFormReducer from './displayUserFormReducer';
import userReducer from './userReducer';
import eventsReducer from './eventsReducer';
import registrationsReducer from './registrationsReducer';

const rootReducer = combineReducers({
  displayUserForm: displayUserFormReducer,
  user: userReducer,
  events: eventsReducer,
  registrations: registrationsReducer,
});

export default rootReducer;
