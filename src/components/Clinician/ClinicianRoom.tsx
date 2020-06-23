import React, { useEffect } from 'react';
import { usePatientService } from '../Patient/PatientDetails';
import { AireRoom } from '../AireRoom';
import ISlotInfo from '../../interfaces/ISlotInfo';
import { useChimeContext } from '../../context/ChimeSdk';

interface IClinicianRoomProps {
  slotId: string;
}

export default function ClinicianRoom(props: IClinicianRoomProps) {

  const [slotInfo, setSlotInfo] = React.useState<ISlotInfo>({ subjectName: '', hostName: '', meeting: {}, attendee: {} });
  const { patient, getPatient } = usePatientService();
  const chime = useChimeContext();

  useEffect(() => {
    if (props.slotId !== '') {
      fetch('https://mbsnz79c79.execute-api.eu-west-2.amazonaws.com/dev/slot?slot=' + props.slotId)
      .then(resp => resp.json())
      .then(json =>
        setSlotInfo({ subjectName: json.slotInfo.SubjectName, hostName: json.slotInfo.HostName, meeting: json.meeting, attendee: json.attendee  })
      );
    }
  }, [props.slotId]);

  useEffect(() => {
    if(slotInfo.hostName.length > 0){ 
    chime.initialiseMeeting({
      meeting: slotInfo.meeting,
      attendee: slotInfo.attendee
    }); 
  }
  }, [slotInfo])

  useEffect(() => {
    console.log(`chime state: ${chime.state}`);
    if(chime.state == "initialised")
    {
      console.log("prepare!");
      chime.prepareMeeting();
    }
  }, [chime.state])

  return (<>
    {(chime.state=="ready" || chime.state=="joined") && <AireRoom/>}
    </>);
}
