import React from 'react';
import { Link } from 'react-router-dom';

const Start = () => {
  return (
    <div className="flex h-screen">
      
      <div className="w-1/2 flex flex-col justify-center items-center bg-green-700 text-white">
        <h2 className="text-3xl font-bold mb-4">Are you a Patient?</h2>
        <div>
          <Link to="/patient/login" className="bg-white text-green-700 py-2 px-4 rounded mr-2">Login</Link>
          <Link to="/patient/signup" className="bg-white text-green-700 py-2 px-4 rounded">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Start;
