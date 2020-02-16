import React from 'react';

import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';

import { Link as RouterLink } from 'react-router-dom';

import { Home as HomeIcon } from '@material-ui/icons';
import { HexagonMultiple } from 'mdi-material-ui';

import { FormattedMessage } from 'react-intl';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  navDrawer: {
    width: '250px',
    backgroundColor: theme.palette.background.default,
    height: '100%',
  },
}));

interface NavDrawerProps {
  open: boolean;
  onClose: () => void;
}

const NavDrawer: React.FunctionComponent<NavDrawerProps> = ({
  open,
  onClose,
}: NavDrawerProps) => {
  const classes = useStyles();

  return (
    <Drawer open={open} ModalProps={{ onBackdropClick: onClose }}>
      <List className={classes.navDrawer}>
        <ListItem button component={RouterLink} to="/" onClick={onClose}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText
            primary={<FormattedMessage id="scenes.Navigation.NavDrawer.home" />}
          />
        </ListItem>
        <ListItem
          button
          component={RouterLink}
          to="/hexcrawl"
          onClick={onClose}
        >
          <ListItemIcon>
            <HexagonMultiple />
          </ListItemIcon>
          <ListItemText
            primary={
              <FormattedMessage id="scenes.Navigation.NavDrawer.hexcrawl" />
            }
          />
        </ListItem>
      </List>
    </Drawer>
  );
};

NavDrawer.defaultProps = {
  open: false,
  onClose: (): void => undefined,
};

export default NavDrawer;
