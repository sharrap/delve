import DrawableHex from './hex';

// A pointy top hex should use Math.PI / 6
class FlatTopHex {
  constructor(x, y, radius) {
    this.rotation = Math.PI / 3;

    this.radiusX = radius;
    this.radiusY = radius * Math.sin(this.rotation);

    this.radius = radius;
    this.x = x;
    this.y = y;
  }

  width() {
    return 2*this.radiusX;
  }

  height() {
    return 2*this.radiusY;
  }

  rotation() {
    return this.rotation;
  }

  containsPoint(x, y) {
    const dx = this.x - x, dy = this.y - y;

    const dist = dx * dx + dy * dy;
    if (dist > this.radiusX * this.radiusX) {
      return false;
    }
    if (dist <= this.radiusY * this.radiusY) {
      return true;
    }

    // Check if centre and x+y are in the same half-space
    const sameSide = (p1, p2) => {
      const eqn = (x, y) => {
        const slope = (x, y) => {
          return (p2.x - p1.x) * x + (p2.y - p1.y) * y;
        }
        return slope(x, y) - slope(p2.x, p2.y);
      };

      return Math.sign(eqn(this.x, this.y)) === Math.sign(eqn(x, y));
    };


    // Get all lines
    const edges = this.edges();
    const edgesOffset = edges.slice(1);
    edgesOffset.push(edges[0]);

    var answer = true;
    var i;
    for (i = 0; i < edges.length; ++i) {
      answer = answer && sameSide(edges[i], edgesOffset[i]);
    }

    return answer;
  }

  edges() {
    // 1/2 = cos(pi/2)
    return [
      {x: this.x - this.radius/2, y: this.y + this.radiusY},
      {x: this.x + this.radius/2, y: this.y + this.radiusY},
      {x: this.x + this.radius, y: this.y},
      {x: this.x + this.radius/2, y: this.y - this.radiusY},
      {x: this.x - this.radius/2, y: this.y - this.radiusY},
      {x: this.x - this.radius, y: this.y}];
  }
}

class FlatTopHexGrid {

  width() {
    return this.dummyHex.width() * 3/4 * this.hexBounds.x;
  }

  height() {
    return this.dummyHex.height() * (this.hexBounds.y + 1/2);
  }

  hexAt(row, column) {
    return this.hexGrid[column][row];
  }

  // bounds: minX, minY, maxX, maxY
  // hexBounds: x, y
  constructor(bounds, hexBounds, hexRadius) {
    const centre = {
      x: (bounds.maxX - bounds.minX) / 2,
      y: (bounds.maxY - bounds.minY) / 2
    };

    this.hexBounds = hexBounds;

    const padding = 10; // How many pixels not to draw important hexes on

    // The maximum hex radius
    const maxXRadius = 4/3 * (centre.x - padding) / hexBounds.x;
    const maxYRadius = (centre.y - padding) /
      ((hexBounds.y + 1/2) * Math.sin(Math.PI / 3));
    const radius = Math.min(hexRadius, maxXRadius, maxYRadius);

    this.dummyHex = new FlatTopHex(0, 0, radius);

    const topLeft = {
      x: centre.x - this.width()/2 + this.dummyHex.width()/2,
      y: centre.y - this.height()/2 + this.dummyHex.height()/2
    };

    var i = 0, j = 0;

    while (topLeft.x + i * this.dummyHex.width() * 3/4 > 0) {
      i -= 1;
    }

    while (topLeft.y + j * this.dummyHex.height() > 0) {
      j -= 1;
    }

    const initj = j;

    this.backgroundHexes = [];
    this.foregroundHexes = [];

    this.hexGrid = [];

    for (;; ++i) {
      for (j = initj;; ++j) {
        const offsetY = Math.abs(i) % 2 === 1 ? this.dummyHex.height() / 2 : 0;
        this.backgroundHexes.push(new DrawableHex(new FlatTopHex(
              topLeft.x + i * this.dummyHex.width() * 3/4,
              topLeft.y + j * this.dummyHex.height() + offsetY,
              radius)));

        if (topLeft.y + j * this.dummyHex.height() + this.dummyHex.height() / 2 > bounds.maxY) {
          break;
        }
      }
      if (topLeft.x + i * this.dummyHex.width() * 3/4 > bounds.maxX) {
        break;
      }
    }

    for (i = 0; i < hexBounds.x; ++i) {
      this.hexGrid.push([]);
      for (j = 0; j < hexBounds.y; ++j) {
        const offsetY = i % 2 === 1 ? this.dummyHex.height() / 2 : 0;
        const newHex = new DrawableHex(new FlatTopHex(
            topLeft.x + i * this.dummyHex.width() * 3/4,
            topLeft.y + j * this.dummyHex.height() + offsetY,
            radius), j, i, true);
        this.foregroundHexes.push(newHex);
        this.hexGrid[i].push(newHex);
      }
    }
  }
}

export { FlatTopHexGrid };
