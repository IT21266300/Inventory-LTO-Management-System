// import Packages
import express, { Router } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import mysql from 'mysql2';

// import routes
import routes from './lib/routes.js'

//configuration
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const PORT = process.env.PORT || 3308;


app.use(
  express.urlencoded({
    extended: true,
  })
)

app.listen(PORT, ()=>{
  console.log("running");
})


// Router calls
app.use('/api', routes);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});
