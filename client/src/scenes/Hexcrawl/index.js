import React from 'react';
import PropTypes from 'prop-types';

import { grey } from '@material-ui/core/colors';

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

const useStyles = makeStyles(() => ({
  hexcrawlGenerator: {
    height: '100%',
    padding: '20px 0',
    backgroundColor: '#ddd',
  },
  hexcrawlGeneratorBackground: {
    height: '100%',
    backgroundColor: '#bbb',
  },
  hexcrawlPaper: {
    padding: '0 5px',
  },
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
  hexcrawlContainer: {
    height: '100%',
    display: 'flex',
    width: '100vw',
    overflow: 'hidden',
  },
}));

function HexcrawlGenerator() {
  const classes = useStyles();

  const minValue = 1;
  const maxValue = 16;

  const [value, setValue] = React.useState(5);

  function changeValue(newValue) {
    setValue(Math.max(minValue, Math.min(newValue, maxValue)));
  }

  return (
    <div className={classes.hexcrawlGeneratorBackground}>
      <Container className={classes.hexcrawlGenerator}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper className={classes.hexcrawlPaper}>
              <Typography gutterBottom>Height in hexes</Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={2}>
                  <HeightIcon />
                </Grid>
                <Grid item xs={6}>
                  <Slider
                    value={value}
                    min={minValue}
                    max={maxValue}
                    step={1}
                    onChange={(event, newValue) => changeValue(newValue)}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Input
                    inputProps={{
                      step: 1,
                      min: minValue,
                      max: maxValue,
                      type: 'number',
                    }}
                    onChange={event => changeValue(event.target.value)}
                    margin="dense"
                    value={value}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={9}>
            <Paper className={classes.hexcrawlPaper}>
              <Typography variant="h6">Txet</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

function GridColor({ children, color1, color2 }) {
  return (
    <React.Fragment>
      {children.map((component, index) =>
        React.cloneElement(component, {
          key: index.toString(),
          style: {
            ...component.props.style,
            backgroundColor: index % 2 === 0 ? color1 : color2,
          },
        })
      )}
    </React.Fragment>
  );
}

GridColor.defaultProps = {
  children: [],
  color1: grey[100],
  color2: grey[100],
};

GridColor.propTypes = {
  children: PropTypes.node,
  color1: PropTypes.any,
  color2: PropTypes.any,
};

function HexcrawlHexEditor() {
  const classes = useStyles();

  return (
    <Paper square variant="outlined" className={classes.hexEditorWindow}>
      <GridColor color1={grey[0]} color2={grey[100]}>
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
                <GridColor color1={grey[500]} color2={grey[700]}>
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
                </GridColor>
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
      </GridColor>
    </Paper>
  );
}

function Hexcrawl() {
  const [hexes, setHexes] = React.useState([]);
  const classes = useStyles();

  return (
    <div className={classes.hexcrawlContainer}>
      <HexcrawlCanvas onSelectHexes={hexes => setHexes(hexes)} />
      <HexcrawlHexEditor hexes={hexes} />
    </div>
  );
}

export { HexcrawlGenerator, Hexcrawl };
