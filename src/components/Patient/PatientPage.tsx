import React, { ChangeEvent, useState, FormEvent, useEffect } from 'react';

import Button from '@material-ui/core/Button';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import { useLocation, useHistory } from 'react-router-dom';
import { Link } from '@material-ui/core';

import PatientRoom from './PatientRoom';

const useStyles = makeStyles({
  container: {
    height: '100vh',
    background: '#0D122B',
  },
  twilioLogo: {
    width: '55%',
    display: 'block',
  },
  videoLogo: {
    width: '25%',
    padding: '2.4em 0 2.1em',
  },
  paper: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    //maxWidth: '460px',
    padding: '2em',
    marginTop: '4em',
    background: 'white',
    color: 'black',
  },
  button: {
    color: 'black',
    background: 'white',
    margin: '0.8em 0 0.7em',
    textTransform: 'none',
  },
  errorMessage: {
    color: 'red',
    display: 'flex',
    alignItems: 'center',
    margin: '1em 0 0.2em',
    '& svg': {
      marginRight: '0.4em',
    },
  },
});

const theme = createMuiTheme({
  palette: {
    type: 'light',
  },
});

export default function PatientPage() {
  const classes = useStyles();
  const [name, setName] = useState('');
  const [inSession, setInSession] = useState(false);
  const history = useHistory();

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    history.replace(`/slot/${name}`);
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container justify="center" alignItems="flex-start" className={classes.container}>
        <Paper className={classes.paper} elevation={6}>
          <div>Patient</div>
          <form onSubmit={handleSubmit}>
            <TextField
              id="menu-name"
              label="SlotId"
              //className={classes.textField}
              value={name}
              onChange={handleNameChange}
              margin="dense"
            />
            <Button type="submit">Join</Button>
          </form>
          {inSession && (
            <Grid item xs={6}>
            </Grid>
          )}
        </Paper>
      </Grid>
    </ThemeProvider>
  );
}
