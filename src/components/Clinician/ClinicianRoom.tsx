import React, { useEffect } from 'react';
import { usePatientService } from '../Patient/PatientDetails';

interface IClinicianRoomProps {
  slotId: string;
}

export default function ClinicianRoom(props: IClinicianRoomProps) {


  const { patient, getPatient } = usePatientService();

  useEffect(() => {
    if (props.slotId !== '') {
      fetch(`https://rgqra2u25c.execute-api.eu-west-2.amazonaws.com/dev/v2/token?slot=${props.slotId}&user=host`)
        .then(res => res.json())
        .then(result => {
          getPatient(result.subjectName);
        });
    }
  }, [props.slotId]);

  return <div>{}</div>;
}
