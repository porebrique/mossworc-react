import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './App';
import { MuiThemeProvider } from 'material-ui';
import registerServiceWorker from './registerServiceWorker';

const app = (
  <MuiThemeProvider>
    <App />
  </MuiThemeProvider>
);

ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();
