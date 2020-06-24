import { useState } from 'react';

export interface IPatientDetails {
  PatientName: string;
  DateOfBirth: string;
  Sex: string;
  NhsNumber: string;
  Postcode: string;
}

export const usePatientService = () => {
  const [patient, setPatient] = useState<IPatientDetails | null>(null); 
  const getPatient = (patientId: string) => {
    getPatientDetails(patientId).then(pd => setPatient(pd));
  };

  return { patient, getPatient };
};

const getPatientDetails = async (patientId: string) => {
  return new Promise<IPatientDetails>(resolve => {
    resolve({
      PatientName: 'Vincent Forbes',
      DateOfBirth: '03-Mar-1990 (20 Years)',
      Sex: 'Male',
      NhsNumber: '123456789',
      Postcode: 'LS12 1FS',
    });
  }); 
};
