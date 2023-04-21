import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { ThemeProvider as MuiThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { StylesProvider } from '@mui/styles';
import { CssBaseline } from '@mui/material';
import { PersistGate } from 'redux-persist/integration/react';
import MUITheme from '../utils/MUITheme';
import { store, persistor } from '../store';
import history from '../utils/history';
import { AppRoutes } from './AppRoutes';
import { ReactComponent as InitGradientsSvg } from './initGradientsSvg.svg';
import { UnderConstruction } from '../../common';
import { ToastNotification } from '../../notification/ToastNotification';

export const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ConnectedRouter history={history}>
        <StylesProvider injectFirst>
          <StyledEngineProvider injectFirst>
            <MuiThemeProvider theme={MUITheme}>
              <CssBaseline>
                <InitGradientsSvg className="initSvgClass" />
                <ToastNotification />
                <UnderConstruction />
                <AppRoutes />
              </CssBaseline>
            </MuiThemeProvider>
          </StyledEngineProvider>
        </StylesProvider>
      </ConnectedRouter>
    </PersistGate>
  </Provider>
);
