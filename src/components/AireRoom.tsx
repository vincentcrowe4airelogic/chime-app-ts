import * as React from 'react';
import { makeStyles, Theme, createStyles, Button, Container, Grid, IconButton } from '@material-ui/core';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';

import { IPatientDetails } from './Patient/PatientDetails';
import { useChimeContext } from '../context/ChimeSdk';
import { useState } from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      marin: 'auto',
      textAlign: 'center',
      fontSize: '1.2rem',
      padding: '10px',
    },
    videoContainer: {
      position: 'relative',
      padding: '10px',
    },
    hostName: {
      position: 'absolute',
      top: '5px',
      left: '5px',
      backgroundColor: '#333',
      border: 'solid 1px green',
      color: '#fff',
      fontSize: '1.2rem',
      fontStyle: 'bold',
      padding: '5px',
    },
    bigVideo: {
      position: 'relative',
      margin: 'auto',
      width: '1040px',
      height: '585px',
    },
    smallVideo: {
      position: 'absolute',
      width: '260px',
      height: '150px',
      top: '25px',
      right: '25px',
      border: 'solid 2px green',
    },
    patientDetails: {
      padding: '5px',
      width: '260px',
      height: '400px',
      top: '250px',
      right: '25px',
      border: 'solid 1px green',
      background: '#333',
    },
    videoSmall: {
      // width: '200px',
      // height: "auto"
      width: "100%"
    },
    videoLarge: {
      // width: '500px',
      // height: "auto"
      width: "100%"
    }


  })
);

interface IAireRoomProps {
  patientDetails?: IPatientDetails | null;
  participantName?: string;
}

interface IVideoTileProps {
    tileInfo: any;
    className: string;
}

const VideoTile = (props: IVideoTileProps) => {

    const chimeContext = useChimeContext();
    const videoElement = React.useRef<HTMLVideoElement>(null!);

    React.useEffect(() => {
        chimeContext.showVideo(props.tileInfo, videoElement.current)
    }, [])

    return (
        <video ref={videoElement} className={props.className}/>
    )
}

export const AireRoom: React.FC<IAireRoomProps> = (props: IAireRoomProps) => {
  const styles = useStyles();
  const localVideo = React.useRef<HTMLVideoElement>(null!);
  const audioElement = React.useRef<HTMLAudioElement>(null!);
  const chime = useChimeContext();
  const [muted, setMuted] = useState(false);

  React.useEffect(() => {
      startMeeting();
  }, [])

  const startMeeting = async () => {
    await chime.startPreview(localVideo.current);
      chime.join(audioElement.current);
  }

  const renderMainVideo = () => {
    if (chime.participants.length > 0) {
      return (
        <React.Fragment>
            <VideoTile tileInfo={chime.participants[0]} className={styles.videoLarge}/>             
        </React.Fragment>
      );
    } else {
      return <div className={styles.title}>We have told {props.participantName ? props.participantName : "The doctor"} you've arrived. They will be with you shortly</div>;
    }
  };

  const toggleMute = () => {
    chime.toggleMute();
    setMuted(chime.isMuted());
  }

  const renderPatientDetails = () => {
    if (!props.patientDetails) return;

    return (
      <div>
        <div>Patient Details</div>
        <div>Name: {props.patientDetails.PatientName}</div>
        <div>Date of Birth: {props.patientDetails.DateOfBirth}</div>
        <div>Sex: {props.patientDetails.Sex}</div>
        <div>NHS number: {props.patientDetails.NhsNumber}</div>
        <div>Postcode: {props.patientDetails.Postcode}</div>
      </div>
    );
  };

  return (
    <>
      <Container maxWidth="lg">
        <Grid container
        justify="space-around"
        alignItems="flex-start">
        {/* <Button variant="contained" onClick={() => alert('not implemented')}>
          Disconnect
        </Button> */}
        <Grid item xs={8}>
        {renderMainVideo()}
        </Grid>
        <Grid item xs={3}>
            <video muted ref={localVideo} className={styles.videoSmall} />
            <IconButton onClick={toggleMute} color="secondary" aria-label="Toggle mute">
              {muted ? <MicOffIcon/> : <MicIcon/>}
            </IconButton>
            {renderPatientDetails()} 
        </Grid>
        <audio ref={audioElement} />
        </Grid>
      </Container>
    </>
  );
};
