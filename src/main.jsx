import React, { useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import App from './App';
import { reduxStore, persistor } from './store/reduxStore';
import { buildTheme } from './constant/themeConstant';
import Loader from './common/Loader';

// Inner wrapper to listen to dynamic Redux theme state
function ThemeRoot({ children }) {
  const mode = useSelector((state) => state.theme?.mode || 'light');
  const theme = useMemo(() => buildTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={reduxStore}>
      <PersistGate loading={<Loader loading position="fixed" />} persistor={persistor}>
        <ThemeRoot>
          <BrowserRouter basename="/">
            <App />
          </BrowserRouter>
        </ThemeRoot>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
