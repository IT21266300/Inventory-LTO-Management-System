import express from 'express';

// import sign in routes
import SignRouter from '../routes/signinRoutes/signin.js';



// import Staff routes
import StaffRouter from '../routes/staffRoutes/staff.js'



const app = express.Router();


// make router paths

// sign in
app.use('/signroute', SignRouter);



// staff
app.use('/staff', StaffRouter);

//tape
app.use('/tape', StaffRouter);

export default app;
