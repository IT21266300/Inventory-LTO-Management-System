import { Navigate, Route, Link } from "react-router-dom";

// import views

// main views
import Dashboard from "View/dashboard";
import Layout from "View/layout";
import RouteProtector from "components/RouteProtector";
import SignIn from "View/signin";
import Test from "View/test";
import Systems from "View/systems";
import AddSystem from "View/systems/addSystem";

//staff views
import StaffDashboard from "View/staff";
import AddStaff from "View/staff/addStaff";
import UpdateStaff from "View/staff/updateStaff";
import Profile from "View/profile";

//tape views
import Tape from "View/tapes";
import NewTape from "View/tapes/newTape";
import NewTapeReuse from "View/tapes/newTapeReuse";
import UpdateTape from "View/tapes/updateTape";
import ViewTape from "View/tapes/tapeDetails";

import TapeSubCategoryTable from "./TapeSubCategoryComponent/TapeSubCategoryTable";
import System from "View/systems/addSystem";
import AddSubSystem from "View/subsystems/addSubSystem";

import TapeQRReader from "components/QRCodeComponent/QRCodeReaderComponent";	

import TapeStock from "View/tapeStock/index";

//log views
import Log from "View/log";
import UpdateLog from "View/log/updateLog";
import NotFound from "View/NotFound";

//locker views
import LockerL from "View/locker/landingPage";
import Locker from "View/locker";
import AddLocker from "View/locker/addLocker";
import UpdateLocker from "View/locker/updateLocker";
import MaharagamaL from "View/locker/maharagama/index";
import PitipanaL from "View/locker/pitipana/index";
import NugegodaL from "View/locker/nugegoda/index";
import HeadOfficeL from "View/locker/headOffice/index";
import MaharagamaLUpdate from "View/locker/maharagama/updateLocker";
import PitipanaLUpdate from "View/locker/pitipana/updateLocker";
import NugegodaLUpdate from "View/locker/nugegoda/updateLocker";
import HeadOfficeLUpdate from "View/locker/headOffice/updateLocker";
import MaharagamaLAdd from "View/locker/maharagama/addLocker";
import PitipanaLAdd from "View/locker/pitipana/addLocker";
import NugegodaLAdd from "View/locker/nugegoda/addLocker";
import HeadOfficeLAdd from "View/locker/headOffice/addLocker";


import Transport from "View/transport";
import HeadOffice from "View/transport/headOffice";
import Maharagama from "View/transport/maharagama";
import Nugegoda from "View/transport/nugegoda";
import Pitipana from "View/transport/pitipana";

const routesConfig = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "/dashboard",
        element: (
          <RouteProtector>
            <Dashboard />
          </RouteProtector>
        ),
      },
      {
        path: "/signin",
        element: <SignIn />,
      },

      {
        path: "/profile",
        element: (
          <RouteProtector>
            <Profile />
          </RouteProtector>
        ),
      },
      {
        path: "/staff",
        element: (
          <RouteProtector>
            <StaffDashboard />
          </RouteProtector>
        ),
      },
      {
        path: "/addStaff",
        element: (
          <RouteProtector allowedPositions={["as"]}>
            <AddStaff />
          </RouteProtector>
        ),
      },
      {
        path: "/updateStaff",
        element: (
          <RouteProtector>
            <UpdateStaff />
          </RouteProtector>
        ),
      },
      {
        path: "/TapeSubCategoryTable",
        element: (
          <RouteProtector>
            <TapeSubCategoryTable />
          </RouteProtector>
        ),
      },
      {
        path: "/tape",
        element: (
          <RouteProtector allowedPositions={["as"]}>
            <Tape />
          </RouteProtector>
        ),
      },
      {
        path: "/qrReader",
        element: (
          <RouteProtector>
            <TapeQRReader />
          </RouteProtector>
        ),
      },
      {
        path: "/newTape/:tapeType",
        element: (
          <RouteProtector>
            <NewTape />
          </RouteProtector>
        ),
      },
      {
        path: "/newTapeReuse",
        element: (
          <RouteProtector>
            <NewTapeReuse />
          </RouteProtector>
        ),
      },
      {
        path: "/updateTape",
        element: (
          <RouteProtector>
            <UpdateTape />
          </RouteProtector>
        ),
      },
      {
        path: "/tape/:tapeId",
        element: <ViewTape />,
      },

      {
        path: "/log",
        element: (
          <RouteProtector allowedPositions={["Admin"]}>
            <Log />
          </RouteProtector>
        ),
      },
      {
        path: "/updateLog",
        element: (
          <RouteProtector>
            <UpdateLog />
          </RouteProtector>
        ),
      },
      {
        path: "/test",
        element: (
          <RouteProtector>
            <Test />
          </RouteProtector>
        ),
      },
      {
        path: "/systems",
        element: (
          <RouteProtector>
            <Systems />
          </RouteProtector>
        ),
      },
      {
        path: "/addSystem",
        element: (
          <RouteProtector>
            <System />
          </RouteProtector>
        ),
      },
      {
        path: "/subsystems",
        element: (
          <RouteProtector>
            <Systems />
          </RouteProtector>
        ),
      },
      {
        path: "/inventory",
        element: (
          <RouteProtector>
            <TapeStock />
          </RouteProtector>
        ),
      },

      {
        path: "/addSubSystem",
        element: (
          <RouteProtector>
            <AddSubSystem />
          </RouteProtector>
        ),
      },
      {
        path: "/lockerL",
        element: (
          <RouteProtector>
            <LockerL />
          </RouteProtector>
        ),

      },
      {
        path: "/locker",
        element: (
          <RouteProtector>
            <Locker />
          </RouteProtector>
        ),
      },
      {
        path: "/addLocker",
        element: (
          <RouteProtector>
            <AddLocker />
          </RouteProtector>
        ),
      },
      {
        path: "/LockerUpdate",
        element: (
          <RouteProtector>
            <UpdateLocker />
          </RouteProtector>
        ),
      },
      {
        path: "/headofficeL",
        element: (
          <RouteProtector>
            <HeadOfficeL />
          </RouteProtector>
        ),
      },
      {
        path: "/maharagamaL",
        element: (
          <RouteProtector>
            <MaharagamaL />
          </RouteProtector>
        ),
      },
        {
          path: "/pitipanaL", 
          element: (
            <RouteProtector>
              <PitipanaL />
            </RouteProtector>
          ),
        },
        {
path: "/nugegodaL",  
element: (
  <RouteProtector>
    <NugegodaL />
  </RouteProtector>
),
        },
        {
          path: "/headofficeLUpdate",
          element: (
            <RouteProtector>
              <HeadOfficeLUpdate />
            </RouteProtector>
          ),

        },
        {
          path: "/maharagamaLUpdate",
          element: (
            <RouteProtector>
              <MaharagamaLUpdate />
            </RouteProtector>
          ),

        },
        {
          path: "/pitipanaLUpdate",
          element: (
            <RouteProtector>
              <PitipanaLUpdate />
            </RouteProtector>
          ),

        },
        {
          path: "/nugegodaLUpdate",
          element: (
            <RouteProtector>
              <NugegodaLUpdate />
            </RouteProtector>
          ),

        },

        {
          path: "/headofficeLAdd",
          element: (
            <RouteProtector>
              <HeadOfficeLAdd />
            </RouteProtector>
          ),
        },
          {
            path: "/maharagamaLAdd",
            element: (
              <RouteProtector>
                <MaharagamaLAdd />
              </RouteProtector>
            ),
          },
          {
            path: "/pitipanaLAdd",
            element: (
              <RouteProtector>
                <PitipanaLAdd />
              </RouteProtector>
            ),
          },
          {
            path: "/nugegodaLAdd",
            element: (
              <RouteProtector>
                <NugegodaLAdd />
              </RouteProtector>
            ),

          },
          

      {
        path: "/unauthorized",
        element: <NotFound />,
      },
      {
        path: "/transport",
        element: (
          <RouteProtector>
            <Transport/>
          </RouteProtector>
        ),
      },
      {
        path: "/headoffice",
        element: (
          <RouteProtector>
            <HeadOffice/>
          </RouteProtector>
        ),
      },
      {
        path: "/maharagama",
        element: (
          <RouteProtector>
            <Maharagama/>
          </RouteProtector>
        ),
      },
      {
        path: "/nugegoda",
        element: (
          <RouteProtector>
            <Nugegoda/>
          </RouteProtector>
        ),
      },
      {
        path: "/pitipana",
        element: (
          <RouteProtector>
            <Pitipana/>
          </RouteProtector>
        ),
      }
    ],
  },
];

export default routesConfig;
