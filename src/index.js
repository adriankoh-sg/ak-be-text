/* eslint-disable import/extensions */
import express from 'express';
import md5 from 'md5';
import jwt from 'jsonwebtoken';
import * as path from 'path';
import { fileURLToPath } from 'url';
import fakeDB from './config.js';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// A port for serving API's
const port = 3000;

// Allow json data
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded());

// root
app.get('/', (req, res) => {
  const src = path.join(dirname, './views/home.html');
  res.sendFile(src);
});

/**
 * Challenge 1 - Part 1
 * API to get token. Need to include username and password in payload
 * to auth. Payload must be included inside body.
 * @example payload = { username: 'adriankoh', password: '123454321' }
 */
// Sent out the login form
app.get('/token', (req, res) => {
  const src = path.join(dirname, './views/login.html');
  res.sendFile(src);
});

// process the login and generate token
app.post('/token', (req, res) => {
  if (req.body) {
    const { username, password } = req.body;
    const { user, auth } = fakeDB;

    if (user.password === md5(password) && user.username === username) {
      const token = jwt.sign(user, auth.secret);

      res.json({
        token: {
          accessToken: token,
        },
      });
    } else {
      // Error in login and return status 401
      res.status(401).send('Error in Login');
    }
  } else {
    // output login form
    res.status(500).send('Unreachable');
  }
});

/**
 * Challenge 1 - Part 2
 * About - page
 * TODO: frontend need to display this page with "Hello World" upon correct JWT token used.
 * */
app.get('/about', (req, res) => {
  const src = path.join(dirname, './views/about.html');
  const { accessToken } = req.body;
  const { auth } = fakeDB;

  if (accessToken) {
    const decode = jwt.verify(accessToken, auth.secret);

    // response with json data
    res.json({
      login: true,
      data: decode,
    });
  }
});

// error page
app.get('/401', (req, res) => {
  const src = path.join(dirname, './views/e401.html');
  res.sendFile(src);
});

// start listen the server
app.listen(port, () => {
  console.info(`Server is running : http://localhost:${port}/`);
});
