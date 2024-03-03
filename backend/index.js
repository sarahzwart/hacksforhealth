const express = require("express")
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const pool = require("./db");
const path=require("path")
const PORT=process.env.PORT ||5000;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const http = require('http');
require("dotenv").config();
const verifyToken = require('./verifyToken');

app.use(cors());
app.use(express.json())

//routes

app.get('/checkToken', verifyToken, (req, res) => {

  res.send({ message: 'Token is valid', user: req.user });
});

//PATIENT

app.post('/signup/therapist', async (req, res) => {
  const { username, password } = req.body;
  

  if (!username || !password ) {
    return res.status(400).json({ message: 'Username, password, and group id are required' });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await pool.query('INSERT INTO therapist (username, password) VALUES ($1, $2) ', [username, hashedPassword]);

    //const userId = result.rows[0].username;

    const token = jwt.sign({ username: username }, jwtSecret, { expiresIn: '2h' });

    return res.status(201).json({ message: 'User created successfully', username, token });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


app.get('/signin/therapist', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const user = await pool.query('SELECT * FROM therapist WHERE username = $1', [username]);

    if (user.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const userId = user.rows[0].id;
    const userName= user.rows[0].username;
    
    //console.log(userName)
    const token = jwt.sign({ username: userName }, jwtSecret, { expiresIn: '2h' });

    return res.status(200).json({ message: 'User authenticated successfully', userId, token, userName });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/signup/patient', async (req, res) => {
  const { username, password, therapist_name } = req.body;

  if (!username || !password || !therapist_name) {
    return res.status(400).json({ message: 'Username, password, and therapist_name are required' });
  }

  try {
    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Try to find the therapist's id by username
    const therapistResult = await pool.query('SELECT id FROM therapist WHERE username = $1', [therapist_name]);

    // Check if a therapist was found
    if (therapistResult.rows.length === 0) {
      return res.status(404).json({ message: 'Therapist not found' });
    }

    const therapistId = therapistResult.rows[0].id;

    
    const patientResult = await pool.query('INSERT INTO patient (username, password, therapist_id) VALUES ($1, $2, $3) RETURNING id', [username, hashedPassword, therapistId]);

    // Assuming you want to return the patient's username and the generated token
    const token = jwt.sign({ username: username }, jwtSecret, { expiresIn: '2h' });

    return res.status(201).json({ message: 'Patient created successfully', username, token });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


app.get('/signin/patient', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const user = await pool.query('SELECT * FROM patient WHERE username = $1', [username]);

    if (user.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const userId = user.rows[0].id;
    const userName= user.rows[0].username;
    
    //console.log(userName)
    const token = jwt.sign({ username: userName }, jwtSecret, { expiresIn: '2h' });

    return res.status(200).json({ message: 'User authenticated successfully', userId, token, userName });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
/// INSERT HEALTH

app.post('/insertHA', async (req, res) => {
  const { patient_username, happiness } = req.body;

  // Validate input
  if (!patient_username || happiness === undefined) {
    return res.status(400).json({ message: 'Patient username and happiness score are required' });
  }

  try {
    // Find the patient ID by username
    const patientResult = await pool.query('SELECT id FROM patient WHERE username = $1', [patient_username]);

    // Check if a patient was found
    if (patientResult.rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const patientId = patientResult.rows[0].id;

    // Insert into HA table
    const haResult = await pool.query(
      'INSERT INTO HA (patient_id, happiness) VALUES ($1, $2) RETURNING id',
      [patientId, happiness]
    );

    // Assuming you want to return the HA record ID
    return res.status(201).json({ message: 'HA record created successfully', haId: haResult.rows[0].id });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/fetchHA', verifyToken, async (req, res) => {
  try {
      // Assuming the JWT token includes the user's ID as 'id'
      const patientId = req.user.username;

      // Query to fetch HA records for the authenticated patient
      const queryResult = await pool.query(
          'SELECT * FROM HA WHERE patient_id = $1',
          [patientId]
      );

      // Check if records exist
      if (queryResult.rows.length === 0) {
          return res.status(404).json({ message: 'No HA records found for the patient' });
      }

      // Return the fetched HA records
      res.json(queryResult.rows);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
  }
});


app.get('/fetchPatientUsernames', verifyToken, async (req, res) => {
  // Assuming the therapist's ID is stored in the req.user object
  const therapistId = req.user.id;

  try {
      const result = await pool.query(
          'SELECT username FROM patient WHERE therapist_id = $1',
          [therapistId]
      );

      const usernames = result.rows; // This will be an array of objects with a username property
      res.json(usernames);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
  }
});


app.get('/fetchPatientHAData/:username', verifyToken, async (req, res) => {
  const { username } = req.params;
  try {
      // First, get the patient's ID based on the username
      const patientResult = await pool.query(
          'SELECT id FROM patient WHERE username = $1',
          [username]
      );

      if (patientResult.rows.length === 0) {
          return res.status(404).json({ message: 'Patient not found' });
      }

      const patientId = patientResult.rows[0].id;

      // Next, fetch all HA data for the patient
      const haDataResult = await pool.query(
          'SELECT * FROM HA WHERE patient_id = $1',
          [patientId]
      );

      res.json(haDataResult.rows);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const jwtSecret = process.env.JWT_SECRET_KEY  





app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
