import React from 'react';

import { Route, Switch } from 'react-router-dom';

import Home from './scenes/Home';
import { Hexcrawl, HexcrawlGenerator } from './scenes/Hexcrawl';
import Navigation from './scenes/Navigation';
import { Login, Register } from './scenes/User';

import { makeStyles } from '@material-ui/core/styles';

import { useAuthentication } from 'src/components/AuthenticationProvider';

import AppProviders from './AppProviders';

const Body: React.SFC<{}> = () => {
  const { loggedIn } = useAuthentication();

  React.useEffect(() => {
    loggedIn().catch(() => undefined);
  }, [loggedIn]);

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
};

const useStyles = makeStyles(() => ({
  app: {
    textAlign: 'center',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
}));

const App: React.FunctionComponent<{}> = () => {
  const classes = useStyles();

  let locale;
  try {
    locale = navigator.language.split(/[-_]/)[0];
  } catch (err) {
    console.log('Could not determine locale', err);
  }

  return (
    <AppProviders locale={locale} maxNotifications={3}>
      <div className={classes.app}>
        <Navigation />
        <Body />
      </div>
    </AppProviders>
  );
};

export default App;
