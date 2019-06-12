/* eslint-env browser */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import displayUserFormReducer from './Reducers/displayUserFormReducer';
import 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';

const store = createStore(
  displayUserFormReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  //a enlever quand il y a la mise en production
);

ReactDOM.render(<Provider store={store}>
  <BrowserRouter>
    <App />
  </BrowserRouter>
</Provider>, document.getElementById('root'));
