import * as React from 'react';
import { useParams } from 'react-router-dom';
import { Button, makeStyles, createStyles, Theme } from '@material-ui/core';
import { usePatientService } from '../Patient/PatientDetails';
import { useChimeContext } from '../../context/ChimeSdk';
import { AireRoom } from '../AireRoom';

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
  meeting: any;
  attendee: any;
}

export const PatientIntro: React.FC = () => {
  const styles = useStyles();
  const chime = useChimeContext();
  const localPreview = React.useRef(null!);
  const { slotId } = useParams();
  const [slotInfo, setSlotInfo] = React.useState<ISlotInfo>({ subjectName: '', hostName: '', meeting: {}, attendee: {} });
  const [ ready, setReady ] = React.useState(false);

  React.useEffect(() => {
    fetch('https://rrz7e3wd7l.execute-api.eu-west-2.amazonaws.com/dev/room', {method: 'POST'})
      .then(resp => resp.json())
      .then(json =>
        setSlotInfo({ subjectName: 'Vincent', hostName: 'The Doctor', meeting: json.meeting, attendee: json.attendee  })
      );
  }, []);

  React.useEffect(() => {
    if(slotInfo.hostName.length > 0)
      chime.initialiseMeeting({meeting: slotInfo.meeting, attendee: slotInfo.attendee});
  }, [slotInfo])

  React.useEffect(() => {
    if(chime.state == "initialised") {
      chime.startPreview(localPreview.current);
    }

  }, [chime.state])

  const connectRoom = () => {
    setReady(true);
  };

  const renderInfo = () => {

    if(ready) return;

    return (
      <>
        <div className={styles.messageContainer}>
          {slotInfo.subjectName == '' ? (
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
          <video muted ref={localPreview} className={styles.localPreview} />
        </div>
      </>
    );
  };

  const renderRoom = () => {
    if (!ready) return;

    return (<AireRoom />)
  };

  return (
    <React.Fragment>
      <div className={styles.title}>Airelogic Video Consultation</div>
      {renderInfo()}
      {renderRoom()}
    </React.Fragment>
  );
};
