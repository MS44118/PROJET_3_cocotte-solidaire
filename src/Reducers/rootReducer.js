import { combineReducers } from 'redux';
import displayUserFormReducer from './displayUserFormReducer';
import userReducer from './userReducer';
import homeReducer from './homeReducer';

const rootReducer = combineReducers({
  displayUserForm: displayUserFormReducer,
  user: userReducer,
  registrationLength: homeReducer,
});

export default rootReducer;
