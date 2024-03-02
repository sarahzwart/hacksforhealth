

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

app.use(cors());
app.use(express.json())

//routes

//PATIENT

app.post('/signup/patient', async (req, res) => {
  const { username, password } = req.body;
  

  if (!username || !password ) {
    return res.status(400).json({ message: 'Username, password, and group id are required' });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await pool.query('INSERT INTO patient (username, password) VALUES ($1, $2) ', [username, hashedPassword]);

    const userId = result.rows[0].username;

    const token = jwt.sign({ username: username }, jwtSecret, { expiresIn: '2h' });

    return res.status(201).json({ message: 'User created successfully', username, token });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/signup/therapist', async (req, res) => {
  const { username, password } = req.body;
  

  if (!username || !password ) {
    return res.status(400).json({ message: 'Username, password, and group id are required' });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await pool.query('INSERT INTO therapist (username, password) VALUES ($1, $2) ', [username, hashedPassword]);

    const userId = result.rows[0].username;

    const token = jwt.sign({ username: username }, jwtSecret, { expiresIn: '2h' });

    return res.status(201).json({ message: 'User created successfully', username, token });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/signin/therapist', async (req, res) => {
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

    return res.status(200).json({ message: 'User authenticated successfully', userId, token, userName,bio,groupId });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});




app.get('/', (req, res) => {
  res.send('Hello World!');
});

const jwtSecret = process.env.JWT_SECRET_KEY  

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

app.get('/health', async (req, res) => {
  try {
  const { username, hashedPassword } = req.body;
  const result = await pool.query('SELECT (username, password) FROM ($1, $2)', [username, hashedPassword]);

  const userId = result.rows[0].id;
  return userId;
  }
  catch(err) {

    console.error(err);
    return res.status(500).json({ message: 'Invalid Username or Password' });
  }


});

app.get('/GetHATable', async (req, res) => {
  try {
    const {PID} = req.body;
  const HAKey = await pool.query('SELECT HAKey FROM patient where PID = $1', [PID]);

  return HAKey;
  }
  catch(err) {

    console.error(err);
    return res.status(500).json({ message: 'Invalid Username or Password' });
  }


});

app.get('/haValAtDate', async (req, res) => {
  try {
    const {HAKey, date} = req.body;
    const levels = await pool.query('SELECT Vals FROM ha where HAKey = $1', [HAKey]);
    const dates = await pool.query('SELECT Date FROM ha where HAKey = $1', [HAKey]);
    for (let i = 0; i < dates.length; i++) {
        if (dates[i] == date) {
          if (levels[i]) {
            value = levels[i];
            return res.status(500).json({ message: 'Found happiness level at this date', value});
          }
        }
    }
  }
  catch(err) {

    console.error(err);
    return res.status(500).json({ message: 'Unable to retrieve happiness values' });
  }


});

app.post('/signin/patient', async (req, res) => {
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
    return res.status(200).json({ message: 'User authenticated successfully', userId, token, userName,bio,groupId });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/AddHAEntry', async (req, res) => {
  try {
    const {happiness, date, PatientID, HAKey} = req.body;
    await pool.query('INSERT into HA (HAKey, Date, PatientID, Vals) VALUES ($1, $2, $3, $4)', [HAKey, date, PatientID, happiness]);
    return res.status(200).json({ message: 'HappinessTable Updated Successfully', HAKey, date, PatientID, happiness});
  }
  catch(err) {

    console.error(err);
    return res.status(500).json({ message: 'Failed to add happiness entry' });
  }


});

app.get('/HA_levels', async (req, res) => {
  try {
    const {HAKey} = req.body;
    const levels = await pool.query('SELECT Vals FROM ha where HAKey = $1', [HAKey]);
    return res.status(200).json({ message: 'Happiness values successfully retrieved', levels});
  }
  catch(err) {

    console.error(err);
    return res.status(500).json({ message: 'Unable to retrieve happiness values' });
  }


});

app.post('/UpdateHAEntry', async (req, res) => {
  try {
    const {happiness, date, PatientID, HAKey} = req.body;
    const dates = await pool.query('SELECT Date FROM ha where HAKey = $1', [HAKey]);
    const levels = await pool.query('SELECT Vals FROM ha where HAKey = $1', [HAKey]);
    const value = -1;
    for (let i = 0; i < dates.length; i++) {
      if (dates[i] == date) {
        if (levels[i]) {
          value = i;
          levels[i] = happiness;
        }
      }
  }
  if (value == -1) {
    return res.status(500).json({ message: 'Failed to add happiness entry' });
  }
    await pool.query('UPDATE ha SET Vals = $1 WHERE HAKey = $2', [levels, HAKey]);
    return res.status(200).json({ message: 'HappinessTable Updated Successfully', HAKey, date, PatientID, happiness});
  }
  catch(err) {

    console.error(err);
    return res.status(500).json({ message: 'Failed to add happiness entry, Server Error' });
  }


});

app.get('/HA_dates', async (req, res) => {
  try {
    const {HAKey} = req.body;
    const dates = await pool.query('SELECT Date FROM ha where HAKey = $1', [HAKey]);
    return res.status(200).json({ message: 'Happiness values successfully retrieved', dates});
  }
  catch(err) {

    console.error(err);
    return res.status(500).json({ message: 'Unable to retrieve happiness values' });
  }


});

app.get('/Thearpist_Patients', async (req, res) => {
  try {
    const {id} = req.body;
    const patientIDs = await pool.query('SELECT PatientIDs FROM therapist WHERE id = $1', [id]);
    return res.status(200).json({ message: 'Patient Numbers successfully retrieved', patientIDs});
  }
  catch(err) {

    console.error(err);
    return res.status(500).json({ message: 'Unable to retrieve patientIDs'});
  }


});

app.get('/patientByID', async (req, res) => {
  try {
    const {PatientID, id} = req.body;
    const patientIDs = await pool.query('SELECT PatientIDs FROM therapist WHERE id = $1', [id]);
    for (let i = 0; i < patientIDs.length; i++) {
        if (patientIDs[i] = PatientID) {
          const user = await pool.query('SELECT * FROM patient WHERE PatientID = $1', [PatientID]);
          return res.status(200).json({ message: 'Patient information successfully retrieved', user});
        }
    }
    return res.status(200).json({ message: 'Patient not registered with this therapist', id});
  }
  catch(err) {

    console.error(err);
    return res.status(500).json({ message: 'Unable to retrieve Patient Information'});
  }
});
  app.delete('/patientDelete', async (req, res) => {
      try {
      const {PatientID} = req.body;
      await pool.query('DELETE FROM patient WHERE PatientID = $1', [PatientID]);
      return res.status(200).json({ message: 'Successfully deleted Patient', PatientID});
      }
      catch(err) {
        return res.status(200).json({ message: 'Unable to delete Patient', PatientID});
      }
  });
  app.delete('/therapistDelete', async (req, res) => {
    try {
    const {id} = req.body;
    await pool.query('DELETE FROM therapist WHERE id = $1', [id]);
    return res.status(200).json({ message: 'Successfully delete therapist', id});
    }
    catch(err) {
      return res.status(200).json({ message: 'Unable to delete therapist', id});
    }
});
app.delete('/haDelete', async (req, res) => {
  try {
  const {HAKey} = req.body;
  await pool.query('DELETE FROM ha WHERE HAKey = $1', [HAKey]);
  return res.status(200).json({ message: 'Succcessfully deleted happiness data for patient', HAKey});
  }
  catch(err) {
    return res.status(200).json({ message: 'Unable to delete happiness data for patient', HAKey});
  }
});

app.delete('/haDeleteDate', async (req, res) => {
  try {
  const {HAKey, Date} = req.body;
  await pool.query('DELETE FROM ha WHERE HAKey = $1 AND Date = $2', [HAKey, Date]);
  return res.status(200).json({ message: 'Successfully deleted happiness datae entry for patient', HAKey, Date});
  }
  catch(err) {
    return res.status(200).json({ message: 'Unable to delete happiness data entry for patient', HAKey, Date});
  }
});


