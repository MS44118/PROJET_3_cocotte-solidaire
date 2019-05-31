/* eslint-env browser */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';

ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'));
