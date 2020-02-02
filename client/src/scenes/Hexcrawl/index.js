import React from 'react';

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
}));

function HexcrawlHexEditor(props) {
  const classes = useStyles();

  return (
    <Paper className={classes.hexEditorWindow}>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h4" className={classes.title}>
            Hex Editor
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <FormControl className={classes.formControl}>
            <InputLabel>Terrain</InputLabel>
            <Select>
              <MenuItem>Plains</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
}

function Hexcrawl() {
  const [hexes, setHexes] = React.useState([]);

  return (
    <div className="Hexcrawl">
      <div className="HexcrawlCanvasContainer">
        <HexcrawlCanvas onSelectHexes={hexes => setHexes(hexes)} />
      </div>
      <HexcrawlHexEditor hexes={hexes} />
    </div>
  );
}

export { HexcrawlGenerator, Hexcrawl };
