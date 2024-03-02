import React from "react";
import "./App.css";
import Patient  from './Patient';
import Login from './Login';
import Therapist from './Therapist';
import CreateAccount from './CreateAcc';

import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route path="login" element={<Login />} />
      <Route path="patient" element={<Patient />} />
      <Route path="therapist" element={<Therapist/>} />
      <Route path="create" element={<CreateAccount />} />
    </Route>
  )
);

function App() {

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
  
}

export default App;

