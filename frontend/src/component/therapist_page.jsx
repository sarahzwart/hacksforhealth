import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Default styling for the calendar
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import styles from './styles.module.css';
import { Line } from 'react-chartjs-2';
// Modal accessibility requirement
Modal.setAppElement('#root');

const moodRatings = [
  { value: 1, emoji: '😔' },
  { value: 2, emoji: '🙁' },
  { value: 3, emoji: '😐' },
  { value: 4, emoji: '🙂' },
  { value: 5, emoji: '😀' },
];

const Therapist = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [lastVisit, setLastVisit] = useState(localStorage.getItem('lastVisit'));
  const navigate = useNavigate(); // Use navigate for redirection

  const [happinessRecords, setHappinessRecords] = useState([]);
  const [error, setError] = useState('');
  const [processedHappinessRecords, setProcessedHappinessRecords] = useState({});

  const processHappinessRecords = (records) => {
    const happinessByDate = {};
  
    records.forEach((record) => {
      const date = new Date(record.created_at).toDateString(); // Convert timestamp to a simple date string
      if (!happinessByDate[date]) {
        happinessByDate[date] = [];
      }
      happinessByDate[date].push(record.happiness);
    });
  
    // Calculate average happiness for each date
    Object.keys(happinessByDate).forEach((date) => {
      const average = happinessByDate[date].reduce((a, b) => a + b, 0) / happinessByDate[date].length;
      happinessByDate[date] = Math.ceil(average); // Round up the average
    });
    console.log("Processed happiness by date:", happinessByDate); // Log processed data
    return happinessByDate;
  };

  useEffect(() => {
    

    const fetchHappinessRecords = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to view happiness records.');
        return;
      }
    
      try {
        const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/fetchHA`, {}, {
          headers: { 'auth-token': token }
        });
        // Directly set the fetched data here without processing
        console.log("Fetched happiness records:", response.data); // Log fetched data
        setHappinessRecords(response.data);
      } catch (err) {
        setError(err.response?.data.message || 'Could not fetch happiness records.');
      }
    };

    const validateTokenAndCheckVisit = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login'); // Redirect to login if no token
        return;
      }

      try {
        // Attempt to validate the token
        await axios.get(`${import.meta.env.VITE_APP_API_URL}/checkToken`, {
          headers: { 'auth-token': localStorage.getItem('token') }
        });
        console.log('Token is valid');
        // If token is valid, check last visit for mood check-in
        const currentTime = new Date().getTime();
        if (!lastVisit || currentTime - lastVisit >= 2000) { // 60000
          setModalIsOpen(true);
        }
      } catch (error) {
        // Token is invalid or expired, redirect to login
        navigate('/login');
      }
    };
    
    fetchHappinessRecords();
    validateTokenAndCheckVisit();
    

  }, [navigate, lastVisit]);
  useEffect(() => {
    if (happinessRecords.length > 0) {
      const processedData = processHappinessRecords(happinessRecords);
      console.log("Setting processed happiness records:", processedData); // Log before setting state
      setProcessedHappinessRecords(processedData);
    }
  }, [happinessRecords]);
  
  const handleMoodSubmit = async (moodValue) => {
    const token = localStorage.getItem('token');
    try {
      // Replace URL with your actual backend endpoint
      await axios.post(`${import.meta.env.VITE_APP_API_URL}/insertHA`, { happiness: moodValue,patient_username : localStorage.getItem('name')  }, {
        headers: { 'auth-token': localStorage.getItem('token') }
      });
      console.log('Mood submitted successfully');
    } catch (error) {
      console.error('Failed to submit mood', error);
    }
    setModalIsOpen(false);
    const currentTime = new Date().getTime();
    localStorage.setItem('lastVisit', currentTime);
  };


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');

    navigate('/patient/login');
  };

  const getTileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toDateString();
      const happinessLevel = processedHappinessRecords[dateString];
      console.log("Date:", dateString, "Happiness Level:", happinessLevel); // Verify this in the console
  
      if (happinessLevel) {
        switch (happinessLevel) {
          case 1: return styles.happinessLevel1;
          case 2: return styles.happinessLevel2;
          case 3: return styles.happinessLevel3;
          case 4: return styles.happinessLevel4;
          case 5: return styles.happinessLevel5;
          default: return styles.happinessNA;
        }
      }
    }
  };


  const HappinessChart = ({ labels, data }) => {
    const chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: 'Happiness Over Time',
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          suggestedMax: 5, // Assuming happiness levels range from 1 to 5
        },
      },
    };
  
    const chartData = {
      labels,
      datasets: [
        {
          label: 'Happiness Level',
          data,
          fill: false,
          backgroundColor: 'rgb(75, 192, 192)',
          borderColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1,
        },
      ],
    };
  
    return <Line options={chartOptions} data={chartData} />;
  };

  return (
    <div className="relative h-screen bg-blue-100">
      <h1 className="text-center text-4xl pt-10">Therapist Dashboard</h1>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="How are you feeling today?"
        className="absolute top-1/4 left-1/4 right-1/4 bottom-1/4 bg-white rounded p-5"
      >
        <h2 className="text-xl mb-4">How are you feeling today?</h2>
        <div className="flex justify-around">
          {moodRatings.map((mood) => (
            <button key={mood.value} onClick={() => handleMoodSubmit(mood.value)} className="text-4xl">
              {mood.emoji}
            </button>
          ))}
        </div>
      </Modal>

      <div className="mt-10">
      <Calendar
  tileClassName={getTileClassName}
/>
      </div>
      <div>
      <h1>Therapist Dashboard</h1>
      <button onClick={handleLogout} className="logout-button">Logout</button>
    </div>

    

    </div>
  );
};

export default Therapist;
