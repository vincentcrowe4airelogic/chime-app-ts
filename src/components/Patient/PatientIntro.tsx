import * as React from 'react';
import { useParams } from 'react-router-dom';
import { Button, makeStyles, createStyles, Theme, responsiveFontSizes } from '@material-ui/core';
import { usePatientService } from '../Patient/PatientDetails';
import { useChimeContext } from '../../context/ChimeSdk';
import { AireRoom } from '../AireRoom';
import ISlotInfo from '../../interfaces/ISlotInfo';

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



export const PatientIntro: React.FC = () => {
  const styles = useStyles();
  const chime = useChimeContext();
  const localPreview = React.useRef(null!);
  const { slotId } = useParams();
  const [slotInfo, setSlotInfo] = React.useState<ISlotInfo>({ subjectName: '', hostName: '', meeting: {}, attendee: {} });
  const [ ready, setReady ] = React.useState(false);

  React.useEffect(() => {
    fetch('https://mbsnz79c79.execute-api.eu-west-2.amazonaws.com/dev/slot?slot=' + slotId)
      .then(resp => resp.json())
      .then(json =>
        setSlotInfo({ subjectName: json.slotInfo.SubjectName, hostName: json.slotInfo.HostName, meeting: json.meeting, attendee: json.attendee  })
      );
  }, []);

  React.useEffect(() => {
    if(slotInfo.hostName.length > 0)
      chime.initialiseMeeting({meeting: slotInfo.meeting, attendee: slotInfo.attendee});
  }, [slotInfo])

  React.useEffect(() => {
    if(chime.state == "initialised") {
      chime.startPreview(localPreview.current);
      chime.prepareMeeting();
    }

  }, [chime.state])

  const connectRoom = async () => {
    await fetch(`https://mbsnz79c79.execute-api.eu-west-2.amazonaws.com/dev/slot/update`, {
      method:"POST",
      body: JSON.stringify({slotId :slotId, subjectName: slotInfo.subjectName, status: "connected"})
    });

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
          <video muted ref={localPreview} style={{width: "100%"}} />
        </div>
      </>
    );
  };

  const renderRoom = () => {
    if (!ready) return;

    return (<AireRoom participantName={slotInfo.hostName} />)
  };

  return (
    <React.Fragment>
      <div className={styles.title}>Airelogic Video Consultation</div>
      {renderInfo()}
      {renderRoom()}
    </React.Fragment>
  );
};
