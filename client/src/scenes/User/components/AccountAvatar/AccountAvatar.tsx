import React from 'react';

import { Avatar, IconButton } from '@material-ui/core';
import { AccountCircle as AccountIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import AccountMenu from '../AccountMenu';
import {
  useAuthenticated,
  useUser,
} from 'src/components/AuthenticationProvider';

import { User } from 'src/types/auth';

function userAvatar(user: User | null): string {
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

  const authenticated = useAuthenticated();
  const user = useUser();

  const [menuOpen, setMenuOpen] = React.useState(false);

  // Prevent menu from re-rendering while closing
  const [menuAuthenticated, setMenuAuthenticated] = React.useState(false);
  const [menuClosing, setMenuClosing] = React.useState(false);

  React.useEffect(() => {
    if (!menuClosing) {
      setMenuAuthenticated(authenticated);
    }
  }, [authenticated, menuClosing]);

  function closeMenu(): void {
    setMenuOpen(false);
  }

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
