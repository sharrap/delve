import React from 'react';

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
import messages from './locale';

import { makeStyles } from '@material-ui/core/styles';

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

const useStyles = makeStyles(() => ({
  app: {
    textAlign: 'center',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
}));

function App() {
  const classes = useStyles();

  let locale;
  try {
    locale = navigator.language.split(/[-_]/)[0];
  } catch (err) {
    console.log('Could not determine locale', err);
  }

  if (!locale || locale === '' || !messages[locale]) locale = 'en';

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <ThemeProvider theme={theme}>
        <ReduxProvider store={reduxStore}>
          <SnackbarProvider maxSnack={3}>
            <Router>
              <div className={classes.app}>
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
