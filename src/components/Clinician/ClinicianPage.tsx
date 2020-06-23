import { Button, TextField, Container, Theme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { createMuiTheme, makeStyles, createStyles, ThemeProvider } from '@material-ui/core/styles';
import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import ClinicianRoom from './ClinicianRoom';
import IPatientSlot from '../../interfaces/IPatientSlot';
import ClinicianSlot from './CinicianSlot';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      margin: 'auto',
      textAlign: 'center',
      fontSize: '1.2rem',
      padding: '10px',
    },
    messageContainer: {
      margin: 'auto',
      width: '40%',
      backgroundColor: '#ccc',
      border: 'solid 1px #fff',
      borderRadius: '5px;',
      color: 'black',
      textAlign: 'center',
    },
    formContainer: {
      backgroundColor: '#558b2f',
      color: 'white',
    },
    button: {
      margin: '10px',
      color: '#558b2f',
    },
    localPreview: {
      margin: 'auto',
      marginTop: '20px',
      padding: '4px',
      width: '40%',
      border: 'solid 1px #fff',
      borderRadius: '5px;',
    },
  })
);

const theme = createMuiTheme({
  palette: {
    type: 'light',
  },
});

export default function ClinicianPage() {
  const styles = useStyles();
  const [name, setName] = useState('');
  const [slots, setSlots] = useState([] as IPatientSlot[]);
  const [currentSlot, setCurrentSlot] = useState('');

  useEffect(() => {
    getSlots();
    const interval = setInterval(() => {
      getSlots();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSlots(
      slots.concat([
        {
          SubjectName: name,
          State: 'creating',
          HostName: 'Doctor',
          SlotId: '',
        },
      ])
    );

    fetch('https://mbsnz79c79.execute-api.eu-west-2.amazonaws.com/dev/v2/slot', {
      method: 'POST',
      body: JSON.stringify({ subjectName: name, hostName: 'Doctor' }),
    });
  };

  const getSlots = () => {
    fetch(`https://mbsnz79c79.execute-api.eu-west-2.amazonaws.com/dev/v2/slots`)
      .then(response => response.json())
      .then(response => setSlots(response.slots));
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const joinSlot = (slotId: string) => {
    setCurrentSlot(slotId);
  };

  return (
    <React.Fragment>
      <Container fixed>
        <div className={styles.title}>Airelogic Video Consultation</div>
        {currentSlot === '' && (
          <div className={styles.messageContainer}>
            <div className={styles.formContainer}>
              <form onSubmit={handleSubmit}>
                <TextField
                  id="menu-name"
                  label="Name"
                  //className={classes.textField}
                  value={name}
                  onChange={handleNameChange}
                />
                <Button type="submit" variant="contained" className={styles.button}>
                  Create Slot
                </Button>
              </form>
            </div>
            {slots.map(s => {
              return <ClinicianSlot slot={s} joinSlot={() => joinSlot(s.SlotId)} />;
            })}
          </div>
        )}
      </Container>
      {currentSlot != '' && (
        <React.Fragment/>
      )}
    </React.Fragment>
  );
}
