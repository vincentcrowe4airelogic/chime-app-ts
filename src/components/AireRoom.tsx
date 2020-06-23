import * as React from 'react';
import { makeStyles, Theme, createStyles, Button } from '@material-ui/core';
import { IPatientDetails } from './Patient/PatientDetails';
import { useChimeContext } from '../context/ChimeSdk';

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
      position: 'absolute',
      width: '260px',
      height: '400px',
      top: '250px',
      right: '25px',
      border: 'solid 1px green',
      background: '#333',
    },
  })
);

interface IAireRoomProps {
  patientDetails?: IPatientDetails | null;
}

interface IVideoTileProps {
    tileInfo: any;
}

const VideoTile = (props: IVideoTileProps) => {

    const chimeContext = useChimeContext();
    const videoElement = React.useRef<HTMLVideoElement>(null!);

    React.useEffect(() => {
        chimeContext.showVideo(props.tileInfo, videoElement.current)
    }, [])

    return (
        <video ref={videoElement} />
    )
}

export const AireRoom: React.FC<IAireRoomProps> = (props: IAireRoomProps) => {
  const styles = useStyles();
  const localVideo = React.useRef<HTMLVideoElement>(null!);
  const audioElement = React.useRef<HTMLAudioElement>(null!);
  const chime = useChimeContext();

  React.useEffect(() => {
      chime.startPreview(localVideo.current);
      chime.join(audioElement.current);
  }, [])

  const renderMainVideo = () => {
    if (chime.participants.length > 0) {
      return (
        <React.Fragment>
          <div className={styles.bigVideo}>
            <VideoTile tileInfo={chime.participants[0]} />            
          </div>
        </React.Fragment>
      );
    } else {
      return <div className={styles.title}>We have told the doctor you've arrived. They will be with you shortly</div>;
    }
  };

  const renderPatientDetails = () => {
    if (!props.patientDetails) return;

    return (
      <div className={styles.patientDetails}>
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
      <div className={styles.videoContainer}>
        <Button variant="contained" onClick={() => alert('not implemented')}>
          Disconnect
        </Button>
        <div>{renderMainVideo()}</div>
        <div className={styles.smallVideo}>
            <video muted ref={localVideo} />
        </div>
        {renderPatientDetails()}
        <audio ref={audioElement} />
      </div>
    </>
  );
};
