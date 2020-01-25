import React from 'react';
import './App.css';

import { IntlProvider, FormattedMessage } from 'react-intl';

import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import {
  Typography
} from '@material-ui/core';

import Home from './scenes/Home';
import Navigation from './scenes/Navigation';

function Hexcrawl() {
  return (
    <Typography variant="h1">
      <FormattedMessage id="hexcrawl.text" defaultMessage="Let's crawl!" />
    </Typography>
  );
}

function Body() {
  return (
    <Switch>
      <Route path="/hexcrawl">
        <Hexcrawl />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <IntlProvider>
      <Router>
        <div className="App">
          <Navigation />
          <Body />
        </div>
      </Router>
    </IntlProvider>
  );
}

export default App;
