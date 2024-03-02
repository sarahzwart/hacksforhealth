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

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  //console.log(req.body);
  //console.log(password);
  //console.log(groupId);

  if (!username || !password || !groupId) {
    return res.status(400).json({ message: 'Username, password, and group id are required' });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await pool.query('INSERT INTO therapist (username, password) VALUES ($1, $2, ', [username, hashedPassword]);

    const userId = result.rows[0].id;

    const token = jwt.sign({ id: userId ,group_id: groupId}, jwtSecret, { expiresIn: '2h' });

    return res.status(201).json({ message: 'User created successfully', userId, groupId, token });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});




app.get('/', (req, res) => {
  res.send('Hello World!');
});

const jwtSecret = process.env.JWT_SECRET_KEY  





app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
