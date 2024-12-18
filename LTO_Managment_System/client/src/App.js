import { Box, CssBaseline, ThemeProvider } from '@mui/material';
// import { themeSettings } from 'theme';
import customTheme from 'customTheme';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';

// import toastify
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//date picker
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { Store } from './store';

// import views

import { useContext } from 'react';
import RouteProtector from 'components/RouteProtector';
import routesConfig from 'components/Routers';

function App() {
  const { state } = useContext(Store);
  const { userInfo } = state;

if(userInfo){
  localStorage.setItem("userPosition", userInfo.position);
}

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="app">
        <BrowserRouter>
          <ToastContainer />
          <ThemeProvider theme={customTheme}>
            <CssBaseline />
            <Routes>
              {routesConfig.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  element={route.element}
                >
                  {route.children && route.children.map((childRoute, childIndex) => (
                    <Route
                      key={childIndex}
                      path={childRoute.path}
                      element={childRoute.element}
                    />
                  ))}
                </Route>
              ))}
            </Routes>
          </ThemeProvider>
        </BrowserRouter>
      </div>
    </LocalizationProvider>
  );
}

export default App;
