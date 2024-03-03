// src/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Adjust based on your backend server URL

export const signUpTherapist = (username, password) => axios.post(`${API_URL}/signup/therapist`, { username, password });
export const signInTherapist = (username, password) => axios.get(`${API_URL}/signin/therapist`, { username, password });
export const signUpPatient = (username, password, therapist_name) => axios.post(`${API_URL}/signup/patient`, { username, password, therapist_name });
export const signInPatient = (username, password) => axios.get(`${API_URL}/signin/patient`, { username, password });
