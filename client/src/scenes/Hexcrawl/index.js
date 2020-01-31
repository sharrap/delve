import React from 'react';

import './HexcrawlGenerator.css';

import {
  Container,
  Grid,
  Input,
  Paper,
  Slider,
  Typography
} from '@material-ui/core';

import {
  Height as HeightIcon
} from '@material-ui/icons';

import { FlatTopHexGrid } from './flatTopHex';

class HexcrawlGenerator extends React.PureComponent {
  minValue = 1;
  maxValue = 16;

  state = {
    value: 5
  }

  setValue(newValue) {
    this.setState(prevState =>
        ({value: Math.max(this.minValue, Math.min(newValue, this.maxValue))}));
  }

  render() {
    return (
      <div className="HexcrawlGeneratorBackground">
        <Container className="HexcrawlGenerator">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper className="HexcrawlPaper">
                <Typography gutterBottom>
                  Height in hexes
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={2}>
                    <HeightIcon />
                  </Grid>
                  <Grid item xs={6}>
                    <Slider value={this.state.value}
                            min={this.minValue}
                            max={this.maxValue}
                            step={1}
                            onChange={(event, newValue) =>
                              this.setValue(newValue)}
                            />
                  </Grid>
                  <Grid item xs={4}>
                    <Input inputProps={{
                             step: 1,
                             min:  this.minValue,
                             max:  this.maxValue,
                             type: 'number'
                           }}
                           onChange={event => this.setValue(event.target.value)}
                           margin="dense" value={this.state.value} />
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

class HexcrawlCanvas extends React.Component {
  constructor(props) {
    super(props);

    this.clickedHexes = [];
    this.hoveredHex = null;
  }

  initHexGrid(minX, minY, maxX, maxY, hexesX, hexesY, maxRadius) {
    const oldGrid = this.grid;

    this.grid = new FlatTopHexGrid(
        {minX: minX, minY: minY, maxX: maxX, maxY: maxY},
        {x: hexesX, y: hexesY},
        maxRadius);

    this.grid.backgroundHexes.forEach((hex, _) => hex.draw(this.refs.canvas));
    this.grid.foregroundHexes.forEach((hex, _) => hex.draw(this.refs.canvas));

    if (oldGrid) {
      this.grid.foregroundHexes.forEach((hex, _) =>
          hex.copyFrom(oldGrid.hexAt(hex.row(), hex.column())));

      if (this.hoveredHex) {
        const oldHex = this.hoveredHex;
        this.hoveredHex = null;
        this.hoverHex(this.grid.hexAt(
              oldHex.row(),
              oldHex.column()));
      }

      if (this.clickedHexes) {
        const oldHexes = this.clickedHexes;
        this.clickedHexes = [];
        oldHexes.forEach((hex, _) =>
            this.clickHex(this.grid.hexAt(hex.row(), hex.column()), true));
      }
    }
  }

  drawCanvas() {
    // Make canvas fill div
    this.refs.canvas.style.width = '100%';
    this.refs.canvas.style.height = '100%';
    this.refs.canvas.width = this.refs.canvas.offsetWidth;
    this.refs.canvas.height = this.refs.canvas.offsetHeight;

    const rect = this.refs.canvas.getBoundingClientRect();

    this.initHexGrid(
        rect.left,
        rect.top,
        rect.right,
        rect.bottom,
        16,
        16,
        30);
  }

  findContainingHex(point) {
    if (point && point.x && point.y) {
      const candidates = this.grid.foregroundHexes.filter(
          hex => hex.geometry.containsPoint(point.x, point.y));

      if (candidates.length > 0) return candidates[0];
    }

    return null;
  }


  drawClickedHexes() {
    this.clickedHexes.forEach((hex, _) =>
        hex.draw(this.refs.canvas));
  }

  hoverHex(hex) {
    if (this.hoveredHex) {
      this.hoveredHex.dehighlight(this.refs.canvas);
    }

    this.drawClickedHexes();

    this.hoveredHex = hex;
    if (this.hoveredHex) {
      this.hoveredHex.highlight(this.refs.canvas);
    }
  }

  clickHex(hex, multiple = false) {
    if (!multiple) {
      this.clickedHexes.forEach((hex, _) => hex.deselect(this.refs.canvas));
      this.clickedHexes = [];
    }
    if (hex) {
      this.clickedHexes.push(hex);
      hex.select(this.refs.canvas);
    }
    if (!multiple || hex) {
      this.props.onClick([...this.clickedHexes]);
    }
  }

  unclickHex(hex) {
    if (hex) {
      this.clickedHexes = this.clickedHexes.filter((filterHex, _) =>
          filterHex !== hex);
      hex.deselect(this.refs.canvas);
      this.props.onClick([...this.clickedHexes]);
    }
  }

  mousePosition(evt) {
    if (this.refs && this.refs.canvas) {
      const rect = this.refs.canvas.getBoundingClientRect();

      if (evt.clientX >= rect.left && evt.clientX <= rect.right
          && evt.clientY >= rect.top && evt.clientY <= rect.bottom) {
        return {
          x: (evt.clientX - rect.left) /
             (rect.right - rect.left) *
             this.refs.canvas.width,
          y: (evt.clientY - rect.top) /
             (rect.bottom - rect.top) *
             this.refs.canvas.height
        };
      }
    }
    return null;
  }

  mouseMoved(evt) {
    if (this.refs.canvas) {
      const point = this.mousePosition(evt);
      this.hoverHex(this.findContainingHex(point));
    }
  }

  mouseClicked(evt) {
    if (this.refs.canvas) {
      // left click
      const point = this.mousePosition(evt);
      if (point) {
        if (evt.button === 0) {
          console.log(point);
          this.clickHex(
              this.findContainingHex(point),
              evt.shiftKey,
              false);
        // right click
        } else if (evt.button === 2) {
          this.unclickHex(this.findContainingHex(point));
        }
      }
    }
  }

  componentDidMount() {
    this.drawCanvas();
    this.refs.canvas.oncontextmenu = e => e.preventDefault();
    window.addEventListener("resize", () => this.drawCanvas());
    window.addEventListener("mousemove", evt => this.mouseMoved(evt));
    window.addEventListener("mousedown", evt => this.mouseClicked(evt));
  }

  componentDidUpdate() {
    this.drawCanvas();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", () => this.drawCanvas());
    window.removeEventListener("mousemove", evt => this.mouseMoved(evt));
    window.removeEventListener("mousedown", evt => this.mouseClicked(evt));
  }

  render() {
    return (
      <canvas ref="canvas" />
    );
  }
}

HexcrawlCanvas.defaultProps = {
  onClick: () => null
};

class HexcrawlHexEditor extends React.PureComponent {
  state = {
    hexes: []
  };

  updateHexes(newHexes) {
    this.setState(prevState => ({hexes: newHexes}));
  };

  render() {
    return (
      <Paper className="HexcrawlHexEditor">
        <Grid>
        </Grid>
        { this.state.hexes.map((hex, _) => "(" + hex.row() + ", " + hex.column() + ")").toString(",") }
      </Paper>
    );
  }
}

class Hexcrawl extends React.PureComponent {
  render() {
    return (
      <div className="Hexcrawl">
        <div className="HexcrawlCanvasContainer">
          <HexcrawlCanvas onClick={ clickedHexes => this.refs.hexEditor.updateHexes(clickedHexes) } />
        </div>
        <HexcrawlHexEditor ref="hexEditor" />
      </div>
    );
  }
}

export { HexcrawlGenerator, Hexcrawl };
