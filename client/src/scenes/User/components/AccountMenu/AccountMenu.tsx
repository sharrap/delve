import React from 'react';
import * as Redux from 'react-redux';

import { Link as RouterLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Menu, MenuProps, MenuItem, ListItem } from '@material-ui/core';
import { useSnackbar } from 'notistack';

import routes from 'src/routes';
import { actions, ThunkDispatch } from 'src/redux';

interface AccountMenuNewProps {
  authenticated?: boolean;
  onItemClick?: (evt: React.MouseEvent) => void;
}

type AccountMenuProps = MenuProps & AccountMenuNewProps;

const AccountMenu: React.FunctionComponent<AccountMenuProps> = ({
  authenticated = false,
  onItemClick = (): void => undefined,
  ...props
}: AccountMenuProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = Redux.useDispatch<ThunkDispatch>();

  function tryLogout(evt: React.MouseEvent): void {
    onItemClick(evt);

    routes.auth
      .logout()
      .then(() => {
        dispatch({ type: actions.auth.LOG_OUT });
        enqueueSnackbar(
          <FormattedMessage id="notifications.Auth.logoutSuccess" />,
          { variant: 'success' }
        );
      })
      .catch(() =>
        enqueueSnackbar(
          <FormattedMessage id="notifications.Auth.logoutFailed" />,
          {
            variant: 'error',
          }
        )
      );
  }

  return (
    <Menu {...props}>
      {!authenticated && (
        <MenuItem dense>
          <ListItem
            dense
            component={RouterLink}
            to="/login"
            onClick={onItemClick}
          >
            <FormattedMessage id="scenes.User.AccountMenu.loginMenuItem" />
          </ListItem>
        </MenuItem>
      )}
      {!authenticated && (
        <MenuItem dense>
          <ListItem
            dense
            component={RouterLink}
            to="/register"
            onClick={onItemClick}
          >
            <FormattedMessage id="scenes.User.AccountMenu.registerMenuItem" />
          </ListItem>
        </MenuItem>
      )}
      {authenticated && (
        <MenuItem dense onClick={tryLogout}>
          <FormattedMessage id="scenes.User.AccountMenu.logoutMenuItem" />
        </MenuItem>
      )}
    </Menu>
  );
};

export default AccountMenu;
