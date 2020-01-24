import React from 'react';

import { FormattedMessage } from 'react-intl';

import {
  AppBar,
  IconButton,
  Toolbar,
  Typography
} from '@material-ui/core';

import {
  Menu as MenuIcon
} from '@material-ui/icons';

import NavDrawer from './components/NavDrawer';

export default class Navigation extends React.PureComponent {
  render() {
    var drawerRef = React.createRef();

    return (
      <AppBar position="sticky">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu"
                      onClick={() => drawerRef.current.open()}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{flexGrow: 1}}>
            <FormattedMessage id="top.titleText" defaultMessage="Delve" />
          </Typography>
          <NavDrawer ref={drawerRef} />
        </Toolbar>
      </AppBar>
    );
  }
}
