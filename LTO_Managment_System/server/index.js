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

// Database connection
const PORT = process.env.PORT || 3308;
// mongoose
//   .connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
//   })
//   .catch((err) => console.log(`connection error: ${err}`));

const db = mysql.createConnection({
  host: "localhost",
  user: 'root',
  password: '1234',
  database: 'lto_db'
})

app.use(
  express.urlencoded({
    extended: true,
  })
)

app.get('/users', (req, res) => {
  const sql = "SELECT * FROM Users";
  db.query(sql, (err, data) => {
    if(err) return res.json(err);
    return res.json(data);
  })
})

app.listen(PORT, ()=>{
  console.log("running");
})


// Router calls
app.use('/api', routes);

// app.use((err, req, res, next) => {
//   res.status(500).send({ message: err.message });
// });
