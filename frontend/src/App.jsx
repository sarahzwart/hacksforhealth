//import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Start from './component/start';
//import Admin from './components_hilo/Admin/Admin';
import Create_patient from './component/create_patient';
import Create_therapist from './component/create_therapist';
import Login_patient from './component/login_patient';
import Login_therapist from './component/login_therapist';
import Patient from './component/patient_page';
import Therapist from './component/therapist_page';


function App() {
  const user = localStorage.getItem("token");

  return (
    <div>
      
      <BrowserRouter>
        {user}
        <Routes>

          {user && <Route path="/" exact element={<Patient />} />}
          <Route path="/patient/signup" element={<Create_patient />} />
         <Route path="/therapist/signup" element={<Create_therapist />} />
         <Route path="/patient/login" element={<Login_patient/>} />
         <Route path="/therapist/login" element={<Login_therapist />} />
         <Route path="/patient" element={<Patient/>} />
         <Route path="/therapist" element={<Therapist />} />
         <Route path="Start" element={<Start />} />
          <Route path="/*" element={<Navigate replace to="/Start" />} />

        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
