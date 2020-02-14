import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Link as RouterLink } from 'react-router-dom';

import axios from 'axios';

import { actions } from '../../../../_redux';

import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItem,
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

import { AccountCircle as AccountIcon } from '@material-ui/icons';

import { useSnackbar } from 'notistack';

function userAvatar(user) {
  return user && user.email && user.email !== '' ? user.email[0] : '?';
}

const useStyles = makeStyles(theme => ({
  avatar: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

function AccountButton({ authenticated, user, setAuthenticated }) {
  const classes = useStyles();
  const buttonRef = React.useRef();

  const { enqueueSnackbar } = useSnackbar();

  const [menuOpen, setMenuOpen] = React.useState(false);

  // Prevent menu from re-rendering while closing
  const [menuAuthenticated, setMenuAuthenticated] = React.useState(false);
  const [menuClosing, setMenuClosing] = React.useState(false);

  React.useEffect(() => {
    if (!menuClosing && !menuOpen) {
      setMenuAuthenticated(authenticated);
    }
  }, [authenticated, menuClosing, menuOpen]);

  function checkAuthenticated() {
    axios
      .get('/user/logged-in', { withCredentials: true })
      .then(resp => setAuthenticated(resp.data))
      .catch(() => setAuthenticated({ authenticated: false }));
  }

  function tryLogout() {
    setMenuOpen(false);

    axios
      .post('/user/signout', { withCredentials: true })
      .then(() => {
        setAuthenticated({ authenticated: false });
        enqueueSnackbar('Successfully signed out.', { variant: 'success' });
      })
      .catch(() =>
        enqueueSnackbar('Sorry, we could not sign you out at this time', {
          variant: 'error',
        })
      );
  }

  React.useEffect(checkAuthenticated, []);

  return (
    <React.Fragment>
      <IconButton ref={buttonRef} onClick={() => setMenuOpen(!menuOpen)}>
        {authenticated ? (
          <Avatar className={classes.avatar}>{userAvatar(user)}</Avatar>
        ) : (
          <Avatar className={classes.avatar}>
            <AccountIcon />
          </Avatar>
        )}
      </IconButton>
      <Menu
        anchorEl={buttonRef.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        getContentAnchorEl={null}
        keepMounted
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onExiting={() => setMenuClosing(true)}
        onExited={() => setMenuClosing(false)}
      >
        {!menuAuthenticated && (
          <MenuItem dense>
            <ListItem dense component={RouterLink} to="/login">
              Sign In
            </ListItem>
          </MenuItem>
        )}
        {!menuAuthenticated && (
          <MenuItem dense>
            <ListItem dense component={RouterLink} to="/register">
              Sign Up
            </ListItem>
          </MenuItem>
        )}
        {menuAuthenticated && (
          <MenuItem dense onClick={tryLogout}>
            Sign Out
          </MenuItem>
        )}
      </Menu>
    </React.Fragment>
  );
}

AccountButton.defaultProps = {
  authenticated: false,
  user: undefined,
  setAuthenticated: () => undefined,
};

AccountButton.propTypes = {
  authenticated: PropTypes.bool,
  user: PropTypes.any,
  setAuthenticated: PropTypes.func,
};

function authenticate({ authenticated, user }) {
  return dispatch =>
    authenticated
      ? dispatch({ type: actions.auth.LOG_IN, user: user })
      : dispatch({ type: actions.auth.LOG_OUT });
}

function mapStateToProps({ auth }) {
  return { authenticated: auth.authenticated, user: auth.user };
}

const actionCreators = {
  setAuthenticated: authenticate,
};

const reduxAccountButton = connect(
  mapStateToProps,
  actionCreators
)(AccountButton);

export default reduxAccountButton;
