import express from 'express';

// import sign in routes
import SignRouter from '../routes/signinRoutes/signin.js';



// import Staff routes

import StaffR from '../routes/staffRouteMysql/staffRoute.js';

// system routes
import SystemRouter from '../routes/tapeRoutes/tapeCategory.js'

//tape routes
import TapeRouter from '../routes/tapeRoutes/tape.js'

import InventoryRouter from '../routes/inventoryRoutes/inventory.js'

//log routes
//import LogRouter from '../routes/logRoutes/log.js'




const app = express.Router();


// make router paths

// sign in
app.use('/signroute', SignRouter);



// staff
// app.use('/staff', StaffRouter);
app.use('/staffs', StaffR);
 
//tape
app.use('/tape', TapeRouter);

//log
//app.use('/log', LogRouter);

app.use('/systems', SystemRouter);

app.use('/inventory', InventoryRouter);

export default app;
