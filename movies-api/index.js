import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express from 'express';
import moviesRouter from './api/movies';
import usersRouter from './api/users';
import './db';

const errHandler = (err, req, res, next) => {
  if (!res.headersSent) {
    if(process.env.NODE_ENV === 'production') {
      return res.status(500).json({ success: false, msg: 'Something went wrong!' });
    }
    return res.status(500).json({ 
      success: false, 
      msg: err?.message || 'Internal server error'
    });
  }
  
  if (typeof next === 'function') {
    next(err);
  }
};


const app = express();

const port = process.env.PORT;

// Enable CORS for all requests
app.use(cors());
app.use('/api/movies', moviesRouter); 
app.use(express.json());
app.use('/api/users', usersRouter);
app.use(errHandler);

if (!process.env.MONGO_DB) {
  console.error('ERROR: MONGO_DB environment variable is not set!');
  process.exit(1);
}

app.listen(port, () => {
  console.info(`Server running at ${port}`);
});
