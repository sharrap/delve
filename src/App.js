import React from 'react';
import { IntlProvider, FormattedMessage } from 'react-intl'
import './App.css';

import { makeStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar'
import Collapse from '@material-ui/core/Collapse'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'

import BluetoothIcon from '@material-ui/icons/Bluetooth'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'

const useStyles = makeStyles(theme => ({
  menu: {
    width: "200px",
    height: "100vh",
    "background-color": "#ddd"
  },
  nested: {
    paddingLeft: theme.spacing(4)
  }
}));

function CollapseList(props) {
  const [ open, setOpen ] = React.useState(true);
  const handleClick = () => { setOpen(!open); };

  return (
    <React.Fragment>
      <ListItem button onClick={handleClick}>
        <ListItemText>
          <FormattedMessage id={props.descId} defaultMessage={props.text} />
        </ListItemText>
        { open ? <ExpandLess /> : <ExpandMore /> }
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List dense={props.dense}>
          {props.children}
        </List>
      </Collapse>
    </React.Fragment>
  );
}

function MenuBar() {
  const classes = useStyles();

  // The side navigation menu
  return (
    <div className={classes.menu}>
      <List dense component="nav">
        <CollapseList dense descId="menuBar.fantasyText" text="Fantasy Generators">
          <ListItem button className={classes.nested}>
            <ListItemIcon>
              <BluetoothIcon />
            </ListItemIcon>
            <ListItemText>
              <FormattedMessage id="menuBar.runeText" defaultMessage="Runes" />
            </ListItemText>
          </ListItem>
        </CollapseList>
      </List>
    </div>
  );
}

function App() {
  return (
    <IntlProvider>
      <div className="App">
        <AppBar position="static">
          <Typography variant="h6">
            <FormattedMessage id="top.titleText" defaultMessage="Delve" />
          </Typography>
        </AppBar>
      </div>
      <MenuBar />
    </IntlProvider>
  );
}

export default App;
