import { terrainColours, terrainTypes } from './terrain';

// A hexagon that can be drawn on the screen. Outsources the actual geometry
// to another class.
export default class DrawableHex {
  constructor(geometryHex, row = null, column = null, foreground = false) {
    this.geometry = geometryHex;
    this.foreground = foreground;

    this.clicked = false;
    this.highlighted = false;

    this.rowIndex = row;
    this.columnIndex = column;

    this.features = { terrain: terrainTypes[0] };
  }

  row() {
    return this.rowIndex;
  }

  column() {
    return this.columnIndex;
  }

  // In the event that the grid was repainted, migrate the data from the old
  // drawable hex in the same position.
  copyFrom(hex) {
    this.features = hex.features;
  }

  draw(canvas) {
    const context = canvas.getContext("2d");

    context.beginPath();
    const hexEdges = this.geometry.edges();

    context.beginPath();
    context.moveTo(
        hexEdges[hexEdges.length - 1].x,
        hexEdges[hexEdges.length - 1].y);
    hexEdges.forEach((point, _) => context.lineTo(point.x, point.y));

    if (!this.foreground) {
      context.strokeStyle = "black";
      context.fillStyle = "#444";
      context.lineWidth = 3;

      context.stroke();
      context.fill();
    } else {
      if (this.highlighted) {
        context.lineWidth = 2;
        context.strokeStyle = "blue";
      } else if (this.clicked) {
        context.lineWidth = 2;
        context.strokeStyle = "red";
      } else {
        context.lineWidth = 3;
        context.strokeStyle = "black";
      }
      context.fillStyle = terrainColours[this.features.terrain];

      context.stroke();
      context.fill();
    }
  }

  select(canvas) {
    this.clicked = true;
    this.draw(canvas);
  }

  deselect(canvas) {
    this.clicked = false;
    this.draw(canvas);
  }

  highlight(canvas) {
    this.highlighted = true;
    this.draw(canvas);
  }

  dehighlight(canvas) {
    this.highlighted = false;
    this.draw(canvas);
  }
}
