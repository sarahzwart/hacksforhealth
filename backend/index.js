

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
const jwtSecret = process.env.JWT_SECRET_KEY;
require("dotenv").config();

app.use(cors());
app.use(express.json())

//routes

//PATIENT

app.post('/signup/patient', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password ) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await pool.query('INSERT INTO patient (username, password) VALUES ($1, $2) RETURNING username', [username, hashedPassword]);

    const newUser = result.rows[0].username;

    const token = jwt.sign({ username: newUser }, jwtSecret, { expiresIn: '2h' });

    return res.status(201).json({ message: 'User created successfully', username: newUser, token });

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
    const user = await pool.query('SELECT id, username, password FROM therapist WHERE username = $1', [username]);

    if (user.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const userId = user.rows[0].id;
    const userName = user.rows[0].username;
    const token = jwt.sign({ username: userName }, jwtSecret, { expiresIn: '2h' });

    return res.status(200).json({ 
      message: 'User authenticated successfully', 
      userId, 
      token, 
      userName
    });

  } catch (err) {
    console.error('Error signing in therapist:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});





app.get('/', (req, res) => {
  res.send('Hello World!');
});



app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

app.get('/health', async (req, res) => {
  try {
    // Incorrect parameters in the query
    const result = await pool.query('SELECT * FROM some_table LIMIT 1');

    // Handling result.rows to check database health
    if (result.rows.length > 0) {
      return res.status(200).json({ message: 'Server is healthy' });
    } else {
      return res.status(500).json({ message: 'Database is not responding' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


app.get('/GetHATable', async (req, res) => {
  try {
    const {PID} = req.body;
  const hakey = await pool.query('SELECT hakey FROM patient where PID = $1', [PID]);

  return hakey;
  }
  catch(err) {

    console.error(err);
    return res.status(500).json({ message: 'Invalid Username or Password' });
  }


});

app.get('/haValAtdate', async (req, res) => {
  try {
    const { hakey, date } = req.body;

    const result = await pool.query('SELECT Vals FROM ha WHERE hakey = $1 AND date = $2', [hakey, date]);

    // Check if any result is found
    if (result.rows.length > 0) {
      const value = result.rows[0].Vals;
      return res.status(200).json({ message: 'Found happiness level at this date', value });
    } else {
      return res.status(404).json({ message: 'Happiness level not found at this date' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/signin/patient', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const user = await pool.query('SELECT id, username, password FROM patient WHERE username = $1', [username]);

    if (user.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const userId = user.rows[0].id;
    const userName = user.rows[0].username;
    const token = jwt.sign({ username: userName }, jwtSecret, { expiresIn: '2h' });
    return res.status(200).json({ message: 'User authenticated successfully', userId, token, userName });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/AddHAEntry', async (req, res) => {
  try {
    const {happiness, date, PatientID, hakey} = req.body;
    await pool.query('INSERT into HA (hakey, date, patientids, vals) VALUES ($1, $2, $3, $4)', [hakey, date, PatientID, happiness]);
    return res.status(200).json({ message: 'HappinessTable Updated Successfully', hakey, date, PatientID, happiness});
  }
  catch(err) {

    console.error(err);
    return res.status(500).json({ message: 'Failed to add happiness entry' });
  }


});

app.get('/HA_levels', async (req, res) => {
  try {
    const {hakey} = req.body;
    const levels = await pool.query('SELECT vals FROM ha where hakey = $1', [hakey]);
    return res.status(200).json({ message: 'Happiness values successfully retrieved', levels});
  }
  catch(err) {

    console.error(err);
    return res.status(500).json({ message: 'Unable to retrieve happiness values' });
  }


});

app.post('/UpdateHAEntry', async (req, res) => {
  try {
    const {happiness, date, PatientID, hakey} = req.body;
    const dates = await pool.query('SELECT date FROM ha where hakey = $1', [hakey]);
    const levels = await pool.query('SELECT vals FROM ha where hakey = $1', [hakey]);
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
    await pool.query('UPdate ha SET vals = $1 WHERE hakey = $2', [levels, hakey]);
    return res.status(200).json({ message: 'HappinessTable Updated Successfully', hakey, date, PatientID, happiness});
  }
  catch(err) {

    console.error(err);
    return res.status(500).json({ message: 'Failed to add happiness entry, Server Error' });
  }


});

app.get('/HA_dates', async (req, res) => {
  try {
    const {hakey} = req.body;
    const dates = await pool.query('SELECT date FROM ha where hakey = $1', [hakey]);
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
    const patientIDs = await pool.query('SELECT patientids FROM therapist WHERE id = $1', [id]);
    return res.status(200).json({ message: 'Patient Numbers successfully retrieved', patientIDs});
  }
  catch(err) {

    console.error(err);
    return res.status(500).json({ message: 'Unable to retrieve patientids'});
  }


});

app.get('/patientByID', async (req, res) => {
  try {
    const { PatientID, id } = req.body;
    const patientIDs = await pool.query('SELECT patientids FROM therapist WHERE id = $1', [id]);

    // Use patientIDs.rows.length instead of patientIDs.length
    for (let i = 0; i < patientIDs.rows.length; i++) {
      // Use === for comparison
      if (patientIDs.rows[i].PatientIDs === PatientID) {
        const user = await pool.query('SELECT * FROM patient WHERE patientid = $1', [PatientID]);
        return res.status(200).json({ message: 'Patient information successfully retrieved', user });
      }
    }
    return res.status(404).json({ message: 'Patient not registered with this therapist', id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

  app.delete('/patientDelete', async (req, res) => {
      try {
      const {PatientID} = req.body;
      await pool.query('DELETE FROM patient WHERE patientid = $1', [PatientID]);
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
  const {hakey} = req.body;
  await pool.query('DELETE FROM ha WHERE hakey = $1', [hakey]);
  return res.status(200).json({ message: 'Succcessfully deleted happiness data for patient', hakey});
  }
  catch(err) {
    return res.status(200).json({ message: 'Unable to delete happiness data for patient', hakey});
  }
});

app.delete('/haDeletedate', async (req, res) => {
  try {
  const {hakey, date} = req.body;
  await pool.query('DELETE FROM ha WHERE hakey = $1 AND date = $2', [hakey, date]);
  return res.status(200).json({ message: 'Successfully deleted happiness datae entry for patient', hakey, date});
  }
  catch(err) {
    return res.status(200).json({ message: 'Unable to delete happiness data entry for patient', hakey, date});
  }
});


