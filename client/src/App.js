import React from 'react';
import './App.css';

import { IntlProvider, FormattedMessage } from 'react-intl';

import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import {
  AppBar,
  IconButton,
  Toolbar,
  Typography
} from '@material-ui/core';

import {
  Menu as MenuIcon
} from '@material-ui/icons';

function Header() {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" style={{flexGrow: 1}}>
          <FormattedMessage id="top.titleText" defaultMessage="Delve" />
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

function Home() {
  return (
    <Typography variant="h1">
      <FormattedMessage id="home.text" defaultMessage="Welcome home!" />
    </Typography>
  );
}

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
          <Header />
          <Body />
        </div>
      </Router>
    </IntlProvider>
  );
}

export default App;
