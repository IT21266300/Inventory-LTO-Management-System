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
import Locker from "View/locker";
import AddLocker from "View/locker/addLocker";
import UpdateLocker from "View/locker/updateLocker";

import Transport from "View/transport";
import HeadOffice from "View/transport/headOffice";
import Maharagama from "View/transport/maharagama";
import Nugegoda from "View/transport/nugegoda";

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
      }
    ],
  },
];

export default routesConfig;
