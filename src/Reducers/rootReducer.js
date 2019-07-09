import { combineReducers } from 'redux';
import displayUserFormReducer from './displayUserFormReducer';
import userReducer from './userReducer';
import updateRegistrationsReducer from './updateEventsReducer';
import updateEventsReducer from './updateRegistrationsReducer';

const rootReducer = combineReducers({
  displayUserForm: displayUserFormReducer,
  user: userReducer,
  updateEventsReducer,
  updateRegistrationsReducer,
});

export default rootReducer;
