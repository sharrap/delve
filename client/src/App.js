import React from 'react';
import './App.css';

import { IntlProvider } from 'react-intl';

import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import Home from './scenes/Home';
import { Hexcrawl, HexcrawlGenerator } from './scenes/Hexcrawl';
import Navigation from './scenes/Navigation';

function Body() {
  return (
    <Switch>
      <Route path="/generate-hexcrawl">
        <HexcrawlGenerator />
      </Route>
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
