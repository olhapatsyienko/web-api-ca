import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express from 'express';
import moviesRouter from './api/movies';
import usersRouter from './api/users';
import userMoviesRouter from './api/userMovies';
import './db';

const errHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return;
  }
  
  console.error('Error details:', {
    message: err?.message,
    stack: err?.stack,
    name: err?.name,
    code: err?.code
  });
  
  if(process.env.NODE_ENV === 'production') {
    return res.status(500).json({ success: false, msg: 'Something went wrong!' });
  }
  
  const errorMessage = err?.message || 'Internal server error';
  return res.status(500).json({ 
    success: false, 
    msg: errorMessage
  });
};


const app = express();

const port = process.env.PORT;

// Enable CORS for all requests
app.use(cors());
app.use(express.json());
app.use('/api/movies', moviesRouter); 
app.use('/api/users', usersRouter);
app.use('/api/user-movies', userMoviesRouter);
app.use(errHandler);

if (!process.env.MONGO_DB) {
  console.error('ERROR: MONGO_DB environment variable is not set!');
  process.exit(1);
}

app.listen(port, () => {
  console.info(`Server running at ${port}`);
});
