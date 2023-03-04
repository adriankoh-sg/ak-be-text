const express = require('express');
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const fakeDB = require('./config');

const app = express();

// A port for serving API's
const port = 3000;

// Allow json data
app.use(express.json());

// root
app.get('/', (req, res) => {
  res.json({
    route: '/',
    authentication: false,
  });
});

/**
 * API to get token. Need to include username and password in payload
 * to auth. Payload must be included inside body.
 * @example payload = { username: 'adriankoh', password: '123454321' }
 */
app.post('/token', (req, res) => {
  const { username, password } = req.body;
  // let username = '';
  // let password = '';

  console.log(fakeDB);

  // username = req.body.username || '';
  // password = req.body.password || '';

  if (fakeDB.user.password === md5(password) && fakeDB.user.username === username) {
    const token = jwt.sign(fakeDB.user, fakeDB.auth.secret);

    res.json({
      token: {
        accessToken: token,
      },
    });
  } else {
    res.json({
      error: 'unable to process resquest',
    });
  }
});

// start listen the server
app.listen(port, () => {
  console.log(`Server is running : http://localhost:${port}/`);
});
