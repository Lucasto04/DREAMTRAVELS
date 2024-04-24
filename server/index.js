import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
app.use(cookieParser());
app.use(session({
    secret: process.env.MONGODB_CONNECTION_STRING,  
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  
}));
console.log('Middleware per CORS, cookie e sessione configurati');

import travelRoutes from './routes/travelRoutes.js';
app.use(travelRoutes);
console.log('Rotte per i Viaggi configurate');

import { login } from "./db.js";

function checkAuth(req, res, next) {
    console.log('Verifica autenticazione in corso...');
    if (!req.session.userId) {
        console.log('Autenticazione fallita: nessun userId in sessione');
        return res.status(403).json({ msg: 'Non autorizzato' });
    }
    console.log('Autenticazione riuscita');
    next();
}

app.post("/login", async (req, res) => {
  console.log('Tentativo di login in corso...');
  const [exists, user] = await login(req.body.username, req.body.password);
  if (exists) {
      console.log('Login riuscito, impostazione userId e username in sessione');
      req.session.userId = user._id;
      req.session.username = user.username;  
      res.json({ msg: "logged in", username: user.username });
  } else {
      console.log('Login fallito: Username o Password non trovati');
      res.status(401).json({ msg: "Username or Password not found" });
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
      if (err) {
          res.status(500).json({ msg: 'Errore durante il logout' });
      } else {
          res.clearCookie('connect.sid', { path: '/' });
          res.status(200).json({ msg: 'Logged out successfully' });
      }
  });
});

app.get('/session', (req, res) => {
  if (req.session.userId) {
    res.status(200).json({ username: req.session.username }); 
  } else {
    res.status(401).send('No active session');
  }
});

app.listen(port, () => {
    console.log(`Server in ascolto sulla porta ${port}`);
});
