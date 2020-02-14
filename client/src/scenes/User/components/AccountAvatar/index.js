import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Link as RouterLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { actions } from 'src/redux';
import routes from 'src/routes';

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

function AccountAvatar({ authenticated, user, setAuthenticated }) {
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
    routes.auth
      .loggedIn()
      .then(resp => setAuthenticated(resp.data))
      .catch(() => setAuthenticated({ authenticated: false }));
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  function tryLogout() {
    closeMenu();

    routes.auth
      .logout()
      .then(() => {
        setAuthenticated({ authenticated: false });
        enqueueSnackbar(
          <FormattedMessage id="scenes.User.AccountAvatar.logoutSuccessSnackbar" />,
          { variant: 'success' }
        );
      })
      .catch(() =>
        enqueueSnackbar(
          <FormattedMessage id="scenes.User.AccountAvatar.logoutFailedSnackbar" />,
          {
            variant: 'error',
          }
        )
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
        onClose={closeMenu}
        onExiting={() => setMenuClosing(true)}
        onExited={() => setMenuClosing(false)}
      >
        {!menuAuthenticated && (
          <MenuItem dense>
            <ListItem
              dense
              component={RouterLink}
              to="/login"
              onClick={closeMenu}
            >
              <FormattedMessage id="scenes.User.AccountAvatar.loginMenuItem" />
            </ListItem>
          </MenuItem>
        )}
        {!menuAuthenticated && (
          <MenuItem dense>
            <ListItem
              dense
              component={RouterLink}
              to="/register"
              onClick={closeMenu}
            >
              <FormattedMessage id="scenes.User.AccountAvatar.registerMenuItem" />
            </ListItem>
          </MenuItem>
        )}
        {menuAuthenticated && (
          <MenuItem dense onClick={tryLogout}>
            <FormattedMessage id="scenes.User.AccountAvatar.logoutMenuItem" />
          </MenuItem>
        )}
      </Menu>
    </React.Fragment>
  );
}

AccountAvatar.defaultProps = {
  authenticated: false,
  user: undefined,
  setAuthenticated: () => undefined,
};

AccountAvatar.propTypes = {
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

const reduxAccountAvatar = connect(
  mapStateToProps,
  actionCreators
)(AccountAvatar);

export default reduxAccountAvatar;
