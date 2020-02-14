import React from 'react';

import { FormattedMessage } from 'react-intl';

import { AccountButton } from '../User';

import { AppBar, IconButton, Toolbar, Typography } from '@material-ui/core';

import { Menu as MenuIcon } from '@material-ui/icons';

import { makeStyles } from '@material-ui/core/styles';

import NavDrawer from './components/NavDrawer';

const useStyles = makeStyles(() => ({
  menuIcon: {
    margin: '8px', // Make same size as Avatar
  },
}));

export default function Navigation() {
  const classes = useStyles();

  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <AppBar position="sticky">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          className={classes.menuIcon}
          onClick={() => setDrawerOpen(true)}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          <FormattedMessage id="top.titleText" defaultMessage="Delve" />
        </Typography>
        <AccountButton />
        <NavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      </Toolbar>
    </AppBar>
  );
}
