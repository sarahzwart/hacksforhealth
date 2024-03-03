//import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Start from './component/start';
//import Admin from './components_hilo/Admin/Admin';
import Create_therapist from './component/create_therapist';
import Login_therapist from './component/login_therapist';
import Therapist from './component/therapist_page';


function App() {
  const user = localStorage.getItem("token");

  return (
    <div>
      
      <BrowserRouter>
        <Routes>

          {user && <Route path="/" exact element={<Therapist />} />}
         <Route path="/patient/signup" element={<Create_therapist />} />
         <Route path="/patient/login" element={<Login_therapist/>} />
         <Route path="/patient" element={<Therapist />} />
         <Route path="Start" element={<Start />} />
          <Route path="/*" element={<Navigate replace to="/patient/login" />} />

        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
