import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { MuiThemeProvider, CssBaseline } from '@material-ui/core';
import theme from './theme';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import ClinicianPage from './components/Clinician/ClinicianPage';
import PatientPage from './components/Patient/PatientPage';
import { PatientIntro } from './components/Patient/PatientIntro';



ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <Router>
        <Switch>
          <Route exact path="/">
          <ClinicianPage />
          </Route>
          <Route path="/clinician">
            <ClinicianPage />
          </Route>
          <Route path="/patient">
            <PatientPage />
          </Route>
          <Route path="/slot/:slotId">
              <PatientIntro />
          </Route>
          <Redirect to="/" />
        </Switch>
    </Router>
  </MuiThemeProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
