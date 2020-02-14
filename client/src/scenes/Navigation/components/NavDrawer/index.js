import React from 'react';
import PropTypes from 'prop-types';

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

export default function NavDrawer({ open, onClose }) {
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
}

NavDrawer.defaultProps = {
  open: false,
  onClose: () => undefined,
};

NavDrawer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
