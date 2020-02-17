import React from 'react';

import { Link as RouterLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Menu, MenuProps, MenuItem, ListItem } from '@material-ui/core';

import { useAuthentication } from 'src/components/AuthenticationProvider';

interface ConnectedAccountMenuNewProps {
  authenticated?: boolean;
  onItemClick?: (evt: React.MouseEvent) => void;
}

type ConnectedAccountMenuProps = MenuProps & ConnectedAccountMenuNewProps;

export type AccountMenuProps = ConnectedAccountMenuProps & {
  logout?: () => void;
};

export const AccountMenu: React.FunctionComponent<AccountMenuProps> = ({
  authenticated = false,
  onItemClick = (): void => undefined,
  logout = (): void => undefined,
  ...props
}: AccountMenuProps) => {
  function tryLogout(evt: React.MouseEvent): void {
    onItemClick(evt);

    logout();
  }

  return (
    <Menu data-testid="account-menu" {...props}>
      {!authenticated && (
        <MenuItem data-testid="login-menu-item" dense onClick={onItemClick}>
          <ListItem dense component={RouterLink} to="/login">
            <FormattedMessage id="scenes.User.AccountMenu.loginMenuItem" />
          </ListItem>
        </MenuItem>
      )}
      {!authenticated && (
        <MenuItem data-testid="register-menu-item" dense onClick={onItemClick}>
          <ListItem dense component={RouterLink} to="/register">
            <FormattedMessage id="scenes.User.AccountMenu.registerMenuItem" />
          </ListItem>
        </MenuItem>
      )}
      {authenticated && (
        <MenuItem data-testid="logout-menu-item" dense onClick={tryLogout}>
          <FormattedMessage id="scenes.User.AccountMenu.logoutMenuItem" />
        </MenuItem>
      )}
    </Menu>
  );
};

const ConnectedAccountMenu: React.FunctionComponent<ConnectedAccountMenuProps> = (
  props: ConnectedAccountMenuProps
) => {
  const { logout } = useAuthentication();

  return (
    <AccountMenu
      {...props}
      logout={(): void => {
        logout().catch(() => undefined);
      }}
    />
  );
};

export default ConnectedAccountMenu;
