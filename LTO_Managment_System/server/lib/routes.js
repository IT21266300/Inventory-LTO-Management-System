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



// import TapeSearch from '../routes/tapeRoutes/tapeSearch.js'

//locker routes
import LockerRouter from '../routes/lockerRoutes/locker.js'
import TapeSearch from '../routes/tapeRoutes/tapeSearch.js'
import LockerRouterH from '../routes/lockerRoutes/HOL/locker.js'
import LockerRouterN from '../routes/lockerRoutes/DRNL/locker.js'
import LockerRouterM from '../routes/lockerRoutes/maharagamaL/locker.js'
import LockerRouterP from '../routes/lockerRoutes/DRPL/locker.js'


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

//locker
app.use('/locker', LockerRouter);
app.use('/lockerH', LockerRouterH);
app.use('/lockerN', LockerRouterN);
app.use('/lockerM', LockerRouterM);
app.use('/lockerP', LockerRouterP);


//log
//app.use('/log', LogRouter);

app.use('/systems', SystemRouter);

app.use('/inventory', InventoryRouter);

app.use('/tapesearch', TapeSearch);

export default app;
