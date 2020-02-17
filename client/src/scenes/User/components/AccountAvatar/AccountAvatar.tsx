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

function userAvatarText(user: User | undefined): string {
  return user ? user.email[0] : '?';
}

const useStyles = makeStyles(theme => ({
  avatar: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

interface AccountAvatarProps {
  authenticated: boolean;
  user?: User;
}

interface PresentationAccountAvatarProps extends AccountAvatarProps {
  menuAuthenticated?: boolean;
  menuOpen?: boolean;
  onClick?: () => void;
  onMenuItemClick?: () => void;
  onMenuClose?: () => void;
  onMenuExiting?: () => void;
  onMenuExited?: () => void;
}

export const PresentationAccountAvatar: React.FunctionComponent<PresentationAccountAvatarProps> = ({
  authenticated,
  user,
  menuAuthenticated = false,
  menuOpen = false,
  onClick = (): void => undefined,
  onMenuItemClick = (): void => undefined,
  onMenuClose = (): void => undefined,
  onMenuExiting = (): void => undefined,
  onMenuExited = (): void => undefined,
}: PresentationAccountAvatarProps) => {
  const classes = useStyles();
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  return (
    <React.Fragment>
      <IconButton
        data-testid="account-avatar-button"
        ref={buttonRef}
        onClick={onClick}
      >
        <Avatar data-testid="account-avatar" className={classes.avatar}>
          {authenticated ? (
            userAvatarText(user)
          ) : (
            <AccountIcon data-testid="account-avatar-logged-out-icon" />
          )}
        </Avatar>
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
        onItemClick={onMenuItemClick}
        onClose={onMenuClose}
        onExiting={onMenuExiting}
        onExited={onMenuExited}
      />
    </React.Fragment>
  );
};

export const AccountAvatar: React.FunctionComponent<AccountAvatarProps> = ({
  authenticated,
  user,
}: AccountAvatarProps) => {
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
    <PresentationAccountAvatar
      authenticated={authenticated}
      user={user}
      menuAuthenticated={menuAuthenticated}
      menuOpen={menuOpen}
      onClick={(): void => setMenuOpen(!menuOpen)}
      onMenuItemClick={closeMenu}
      onMenuClose={closeMenu}
      onMenuExiting={(): void => setMenuClosing(true)}
      onMenuExited={(): void => setMenuClosing(false)}
    />
  );
};

const ConnectedAccountAvatar: React.FunctionComponent = () => {
  const authenticated = useAuthenticated();
  const user = useUser();

  return <AccountAvatar authenticated={authenticated} user={user} />;
};

export default ConnectedAccountAvatar;
