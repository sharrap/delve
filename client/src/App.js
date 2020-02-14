import React from 'react';
import './App.css';

import { Provider as ReduxProvider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import { purple, red } from '@material-ui/core/colors';

import Home from './scenes/Home';
import { Hexcrawl, HexcrawlGenerator } from './scenes/Hexcrawl';
import Navigation from './scenes/Navigation';
import { Login, Register } from './scenes/User';

import { store as reduxStore } from './redux';

const theme = createMuiTheme({
  palette: {
    primary: purple,
    secondary: red,
    // background: {
    //   paper: grey[500]
    // }
  },
});

function Body() {
  return (
    <Switch>
      <Route path="/generate-hexcrawl">
        <HexcrawlGenerator />
      </Route>
      <Route path="/hexcrawl">
        <Hexcrawl />
      </Route>
      <Route path="/register">
        <Register />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <IntlProvider locale="en">
      <ThemeProvider theme={theme}>
        <ReduxProvider store={reduxStore}>
          <SnackbarProvider maxSnack={3}>
            <Router>
              <div className="App">
                <Navigation />
                <Body />
              </div>
            </Router>
          </SnackbarProvider>
        </ReduxProvider>
      </ThemeProvider>
    </IntlProvider>
  );
}

export default App;
