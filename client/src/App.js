import React from 'react';
import { IntlProvider, FormattedMessage } from 'react-intl'
import './App.css';

import { AppBar, Typography } from '@material-ui/core'

function App() {
  return (
    <IntlProvider>
      <div className="App">
        <AppBar position="sticky">
          <Typography variant="h6">
            <FormattedMessage id="top.titleText" defaultMessage="Delve" />
          </Typography>
        </AppBar>
        <div style={{display: "flex"}}>
        </div>
      </div>
    </IntlProvider>
  );
}

export default App;
