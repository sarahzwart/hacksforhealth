

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
    const {happiness, date, PID, HAKey} = req.body;
    await pool.query('INSERT into HA (HAKey, Date, PID, Vals) VALUES ($1, $2, $3, $4)', [HAKey, date, PID, happiness]);
    return res.status(200).json({ message: 'HappinessTable Updated Successfully', HAKey, date, PID, happiness});
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
