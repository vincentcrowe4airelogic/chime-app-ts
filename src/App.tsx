import React from 'react';
import './App.css';
import { Meeting } from './components/Meeting';
import { ChimeProvider } from './context/ChimeSdk';

function App() {
  return (
    <div className="App">
      <ChimeProvider>
        <Meeting />
      </ChimeProvider>      
    </div>
  );
}

export default App;
