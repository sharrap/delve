import React from 'react';
import * as Redux from 'react-redux';

import { Avatar, IconButton } from '@material-ui/core';
import { AccountCircle as AccountIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import AccountMenu from '../AccountMenu';

import { actions, AuthUser, RootState, ThunkDispatch } from 'src/redux';
import routes from 'src/routes';

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

  const [menuOpen, setMenuOpen] = React.useState(false);

  // Prevent menu from re-rendering while closing
  const [menuAuthenticated, setMenuAuthenticated] = React.useState(false);
  const [menuClosing, setMenuClosing] = React.useState(false);

  React.useEffect(() => {
    if (!menuClosing) {
      setMenuAuthenticated(authenticated);
    }
  }, [authenticated, menuClosing]);

  function checkAuthenticated(): void {
    routes.auth
      .loggedIn()
      .then(resp => {
        if (resp.data.authenticated) {
          dispatch({ type: actions.auth.LOG_IN, user: resp.data.user });
        } else {
          dispatch({ type: actions.auth.LOG_OUT });
        }
      })
      .catch(() => dispatch({ type: actions.auth.LOG_OUT }));
  }

  function closeMenu(): void {
    setMenuOpen(false);
  }

  React.useEffect(checkAuthenticated, []);

  return (
    <React.Fragment>
      <IconButton
        data-testid="account-avatar-button"
        ref={buttonRef}
        onClick={(): void => setMenuOpen(!menuOpen)}
      >
        {authenticated ? (
          <Avatar className={classes.avatar}>{userAvatar(user)}</Avatar>
        ) : (
          <Avatar className={classes.avatar}>
            <AccountIcon />
          </Avatar>
        )}
      </IconButton>
      <AccountMenu
        authenticated={menuAuthenticated}
        anchorEl={buttonRef.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        getContentAnchorEl={null}
        keepMounted
        open={menuOpen}
        onItemClick={closeMenu}
        onClose={closeMenu}
        onExiting={(): void => setMenuClosing(true)}
        onExited={(): void => setMenuClosing(false)}
      />
    </React.Fragment>
  );
};

export default AccountAvatar;
