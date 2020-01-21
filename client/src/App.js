import React from 'react';
import { IntlProvider, FormattedMessage } from 'react-intl'
import './App.css';

import { makeStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Collapse from '@material-ui/core/Collapse'
import Container from '@material-ui/core/Container'
import FormControl from '@material-ui/core/FormControl'
import Grid from '@material-ui/core/Grid'
import InputLabel from '@material-ui/core/InputLabel'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import Select from '@material-ui/core/Select'
import Typography from '@material-ui/core/Typography'

import BluetoothIcon from '@material-ui/icons/Bluetooth'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'

const useStyles = makeStyles(theme => ({
  menu: {
    "min-width": "200px",
    height: "100vh",
    "background-color": "#ddd"
  },
  nested: {
    paddingLeft: theme.spacing(4)
  },
  formControl: {
    width: "120px",
  },
  button: {
    width: "250px",
  },
  container: {
    backgroundColor: "#eee",
    padding: "20px",
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
  }
}));

// Just pulls data from the server. Simple API test
function SimpleGenerator(props) {
  const classes = useStyles();

  const [ value, setValue ] = React.useState("");
  const [ result, setResult ] = React.useState("");
  const handleChange = event => { setValue(event.target.value); };

  const getResult = () => { setResult("Example"); }

  return (
    <Container className={classes.container}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography variant="h4">
              Simple Generator
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-label-id">Select Table</InputLabel>
              <Select labelId="demo-label-id" id="test" value={value} onChange={handleChange}>
                <MenuItem value="a">Table 1</MenuItem>
                <MenuItem value="b">Table 2</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" color="primary" className={classes.button} onClick={getResult}>
              Get "Random" Result
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} style={{display: result === "" ? "none" : ""}}>
          <Paper className={classes.paper}>
            {result}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

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
            <ListItemText>
              <FormattedMessage id="menuBar.simpleGeneratorText" defaultMessage="Simple Generator" />
            </ListItemText>
          </ListItem>
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
        <div style={{display: "flex"}}>
          <MenuBar />
          <SimpleGenerator />
        </div>
      </div>
    </IntlProvider>
  );
}

export default App;
