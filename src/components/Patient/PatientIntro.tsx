import * as React from 'react';
import { useParams } from 'react-router-dom';
import { Button, makeStyles, createStyles, Theme } from '@material-ui/core';
import { usePatientService } from '../Patient/PatientDetails';

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
      marginTop: '20px',
      padding: '10px',
      width: '40%',
      backgroundColor: '#ccc',
      border: 'solid 1px #fff',
      borderRadius: '5px;',
      color: 'black',
      textAlign: 'center',
    },
    button: {
      backgroundColor: '#333',
      border: 'solid 1px black',
      margin: '10px',
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

interface ISlotInfo {
  subjectName: string;
  hostName: string;
  token: string;
}

export const PatientIntro: React.FC = () => {
  const styles = useStyles();
  const { slotId } = useParams();
  const [slotInfo, setSlotInfo] = React.useState<ISlotInfo>({ subjectName: '', hostName: '', token: '' });


  React.useEffect(() => {
    fetch('https://mbsnz79c79.execute-api.eu-west-2.amazonaws.com/dev/slot?slot=' + slotId)
      .then(resp => resp.json())
      .then(json =>
        setSlotInfo({ subjectName: json.slotInfo.SubjectName, hostName: json.slotInfo.HostName, token: json.token })
      );
  }, []);

  const connectRoom = () => {
  };

  const renderInfo = () => {

    return (
      <>
        <div className={styles.messageContainer}>
          {slotInfo.token == '' ? (
            <div>Loading appointment information...</div>
          ) : (
            <div>
              <div>
                Hi <b>{slotInfo.subjectName}</b>,
              </div>
              <div>
                You've got an appointment with <b>{slotInfo.hostName}</b> today.
              </div>
              <div>
                <Button className={styles.button} onClick={connectRoom}>
                  Let's get started
                </Button>
              </div>
              <div>
                <Button className={styles.button}>I'm not {slotInfo.subjectName}</Button>
              </div>
            </div>
          )}
        </div>
        <div className={styles.localPreview}>
        </div>
      </>
    );
  };

  const renderRoom = () => {

    return;
  };

  return (
    <React.Fragment>
      <div className={styles.title}>Airelogic Video Consultation</div>
      {renderInfo()}
      {renderRoom()}
    </React.Fragment>
  );
};
