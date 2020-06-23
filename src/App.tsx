import React from 'react';
import './App.css';
import { Meeting } from './components/Meeting';
import { ChimeProvider } from './context/ChimeSdk';
import { PatientIntro } from './components/Patient/PatientIntro';

function App() {
  return (
    <div className="App">
      <ChimeProvider>
        <PatientIntro />
      </ChimeProvider>      
    </div>
  );
}

export default App;
