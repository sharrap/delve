import React from 'react';
import * as Redux from 'react-redux';

import { Link as RouterLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { actions, AuthUser, RootState, ThunkDispatch } from 'src/redux';
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

function userAvatar(user: AuthUser | undefined): string {
  return user && user.email && user.email !== '' ? user.email[0] : '?';
}

const useStyles = makeStyles(theme => ({
  avatar: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const AccountAvatar: React.FunctionComponent = () => {
  const classes = useStyles();
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const authenticated = Redux.useSelector<RootState, boolean>(
    state => state.auth.authenticated
  );
  const user = Redux.useSelector<RootState, AuthUser | undefined>(
    state => state.auth.user
  );

  const dispatch = Redux.useDispatch<ThunkDispatch>();

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

  function checkAuthenticated(): void {
    routes.auth
      .loggedIn()
      .then(resp =>
        dispatch({ type: actions.auth.LOG_IN, user: resp.data.user })
      )
      .catch(() => dispatch({ type: actions.auth.LOG_OUT }));
  }

  function closeMenu(): void {
    setMenuOpen(false);
  }

  function tryLogout(): void {
    closeMenu();

    routes.auth
      .logout()
      .then(() => {
        dispatch({ type: actions.auth.LOG_OUT });
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
      <IconButton ref={buttonRef} onClick={(): void => setMenuOpen(!menuOpen)}>
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
        onExiting={(): void => setMenuClosing(true)}
        onExited={(): void => setMenuClosing(false)}
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
};

export default AccountAvatar;
