import React from 'react';

import { grey } from '@material-ui/core/colors';

import './HexcrawlGenerator.css';

import {
  Container,
  FormControl,
  Grid,
  Input,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

import { Height as HeightIcon } from '@material-ui/icons';

import HexcrawlCanvas from './components/HexcrawlCanvas';

class HexcrawlGenerator extends React.PureComponent {
  minValue = 1;
  maxValue = 16;

  state = {
    value: 5,
  };

  setValue(newValue) {
    this.setState(prevState => ({
      value: Math.max(this.minValue, Math.min(newValue, this.maxValue)),
    }));
  }

  render() {
    return (
      <div className="HexcrawlGeneratorBackground">
        <Container className="HexcrawlGenerator">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper className="HexcrawlPaper">
                <Typography gutterBottom>Height in hexes</Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={2}>
                    <HeightIcon />
                  </Grid>
                  <Grid item xs={6}>
                    <Slider
                      value={this.state.value}
                      min={this.minValue}
                      max={this.maxValue}
                      step={1}
                      onChange={(event, newValue) => this.setValue(newValue)}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Input
                      inputProps={{
                        step: 1,
                        min: this.minValue,
                        max: this.maxValue,
                        type: 'number',
                      }}
                      onChange={event => this.setValue(event.target.value)}
                      margin="dense"
                      value={this.state.value}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={9}>
              <Paper className="HexcrawlPaper">
                <Typography variant="h6">Txet</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </div>
    );
  }
}

const useStyles = makeStyles(theme => ({
  title: {
    paddingTop: 20,
  },
  hexEditorWindow: {
    width: '400px',
  },
  formControl: {
    minWidth: 120,
  },
  sidebarSection: {
    padding: '5px 0',
  },
}));

function GridColour(props) {
  const classes = useStyles();

  return (
    <React.Fragment>
      {props.children.map((component, index) =>
        React.cloneElement(component, {
          style: {
            ...component.props.style,
            backgroundColor: index % 2 === 0 ? props.color1 : props.color2,
          },
        })
      )}
    </React.Fragment>
  );
}

function HexcrawlHexEditor(props) {
  const classes = useStyles();

  return (
    <Paper square variant="outlined" className={classes.hexEditorWindow}>
      <GridColour color1={grey[0]} color2={grey[100]}>
        <Paper square variant="outlined" className={classes.sidebarSection}>
          <Typography variant="h4" className={classes.title}>
            Hex Viewer
          </Typography>
        </Paper>
        <Paper square variant="outlined" className={classes.sidebarSection}>
          <FormControl className={classes.formControl}>
            <InputLabel>Terrain</InputLabel>
            <Select>
              <MenuItem>Plains</MenuItem>
            </Select>
          </FormControl>
        </Paper>
        <Paper square variant="outlined" className={classes.sidebarSection}>
          <Typography variant="h6">Known Points of Interest</Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Position</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <GridColour color1={grey[500]} color2={grey[700]}>
                  <TableRow hover>
                    <TableCell>Bagwell Tower</TableCell>
                    <TableCell>Tower</TableCell>
                    <TableCell>Road</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>Moria</TableCell>
                    <TableCell>Mine</TableCell>
                    <TableCell>River</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>Isengard</TableCell>
                    <TableCell>Tower</TableCell>
                    <TableCell>River, Road</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>Weathertop</TableCell>
                    <TableCell>Ruin</TableCell>
                    <TableCell>Wilderness</TableCell>
                  </TableRow>
                </GridColour>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <Paper square variant="outlined" className={classes.sidebarSection}>
          <Typography variant="h6">Unique Random Encounters</Typography>
        </Paper>
        <Paper square variant="outlined" className={classes.sidebarSection}>
          <Typography variant="h6">Repeatable Random Encounters</Typography>
        </Paper>
      </GridColour>
    </Paper>
  );
}

function Hexcrawl() {
  const [hexes, setHexes] = React.useState([]);

  return (
    <div className="Hexcrawl">
      <HexcrawlCanvas onSelectHexes={hexes => setHexes(hexes)} />
      <HexcrawlHexEditor hexes={hexes} />
    </div>
  );
}

export { HexcrawlGenerator, Hexcrawl };
