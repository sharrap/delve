import React from 'react';

import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';

import {
  Home as HomeIcon
} from '@material-ui/icons';

import { HexagonMultiple } from 'mdi-material-ui';

import "./NavDrawer.css"

export default class NavDrawer extends React.PureComponent {
  state = {
    open: false
  };

  open() {
    this.setState(prevState => ({open: true}));
  }

  close() {
    this.setState(prevState => ({open: false}));
  }

  render() {
    const close = () => this.close();

    return (
      <Drawer open={this.state.open}
              ModalProps={{ onBackdropClick: close }}>
        <List className="NavDrawer">
          <ListItem button component="a" href="/" onClick={close}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button component="a" href="/hexcrawl" onClick={close}>
            <ListItemIcon>
              <HexagonMultiple />
            </ListItemIcon>
            <ListItemText primary="Hexcrawl" />
          </ListItem>
        </List>
      </Drawer>
    );
  }
}
