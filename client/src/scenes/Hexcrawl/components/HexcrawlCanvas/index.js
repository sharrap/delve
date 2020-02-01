import React from 'react';

import { FlatTopHexGrid } from './flatTopHex';

export default function HexcrawlCanvas(props) {
  const canvas = React.useRef();
  const [state, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    dispatch(drawCanvas(canvas.current, initialState));
  }, [canvas]);
  React.useEffect(() => {
    const resize = () => dispatch(drawCanvas(canvas.current, state));
    const mouseMove = evt =>
      dispatch(mouseMoved(evt, state.grid, canvas.current));
    const mouseDown = evt =>
      dispatch(mouseClicked(evt, state.grid, canvas.current));
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('mousedown', mouseDown);
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mousedown', mouseDown);
    };
  }, [canvas, state]);
  React.useEffect(() => {
    canvas.current.oncontextmenu = e => e.preventDefault();
  }, [canvas]);
  React.useEffect(() => {
    props.onSelectHexes(state.clickedHexes);
  }, [state.clickedHexes, props]);
  return <canvas ref={canvas} />;
}

HexcrawlCanvas.defaultProps = {
  onSelectHexes: () => {},
};

const initialState = { hoveredHex: null, clickedHexes: [], grid: null };

function reducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return {
        grid: action.grid,
        hoveredHex: action.hoveredHex,
        clickedHexes: action.clickedHexes,
      };
    case 'HOVER':
      if (state.hoveredHex) {
        state.hoveredHex.dehighlight(action.canvas);
      }
      if (state.hoveredHex || action.hex) {
        state.clickedHexes.forEach((hex, _) => hex.draw(action.canvas));
      }
      if (action.hex) {
        action.hex.highlight(action.canvas);
      }
      return { ...state, hoveredHex: action.hex };
    case 'SELECT':
      let newClickedHexes = state.clickedHexes;
      if (!action.multiple) {
        newClickedHexes = [];
        state.clickedHexes.forEach((hex, _) => hex.deselect(action.canvas));
      }
      if (action.hex) {
        newClickedHexes = newClickedHexes.concat([action.hex]);
        action.hex.select(action.canvas);
      }
      return { ...state, clickedHexes: newClickedHexes };
    case 'DESELECT':
      if (action.hex) {
        action.hex.deselect(action.canvas);
        if (state.clickedHexes.includes(action.hex)) {
          return {
            ...state,
            clickedHexes: state.clickedHexes.filter(
              (hex, _) => hex !== action.hex
            ),
          };
        }
      }
      return state;
    default:
      return state;
  }
}

function drawCanvas(canvas, state) {
  // Make canvas fill div
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const rect = canvas.getBoundingClientRect();

  return initHexGrid(
    canvas,
    state,
    rect.left,
    rect.top,
    rect.right,
    rect.bottom,
    16,
    16,
    30
  );
}

function initHexGrid(
  canvas,
  state,
  minX,
  minY,
  maxX,
  maxY,
  hexesX,
  hexesY,
  maxRadius
) {
  const newGrid = new FlatTopHexGrid(
    { minX: minX, minY: minY, maxX: maxX, maxY: maxY },
    { x: hexesX, y: hexesY },
    maxRadius
  );

  newGrid.backgroundHexes.forEach((hex, _) => hex.draw(canvas));
  newGrid.foregroundHexes.forEach((hex, _) => hex.draw(canvas));

  let newHoveredHex = null,
    newClickedHexes = [];

  if (state.grid) {
    newGrid.foregroundHexes.forEach((hex, _) =>
      hex.copyFrom(state.grid.hexAt(hex.row(), hex.column()))
    );

    if (state.hoveredHex) {
      newHoveredHex = newGrid.hexAt(
        state.hoveredHex.row(),
        state.hoveredHex.column()
      );
      newHoveredHex.highlight(canvas);
    }

    if (state.clickedHexes) {
      newClickedHexes = state.clickedHexes.map((hex, _) =>
        newGrid.hexAt(hex.row(), hex.column())
      );
      newClickedHexes.forEach((hex, _) => hex.select(canvas));
    }
  }

  return {
    type: 'INIT',
    canvas: canvas,
    grid: newGrid,
    hoveredHex: newHoveredHex,
    clickedHexes: newClickedHexes,
  };
}

function findContainingHex(grid, point) {
  if (point && point.x && point.y && grid) {
    const candidates = grid.foregroundHexes.filter(hex =>
      hex.geometry.containsPoint(point.x, point.y)
    );

    if (candidates.length > 0) return candidates[0];
  }

  return null;
}

function mousePosition(evt, canvas) {
  if (canvas) {
    const rect = canvas.getBoundingClientRect();

    if (
      evt.clientX >= rect.left &&
      evt.clientX <= rect.right &&
      evt.clientY >= rect.top &&
      evt.clientY <= rect.bottom
    ) {
      return {
        x:
          ((evt.clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
        y:
          ((evt.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height,
      };
    }
  }
  return null;
}

function mouseMoved(evt, grid, canvas) {
  if (canvas) {
    const point = mousePosition(evt, canvas);
    return {
      type: 'HOVER',
      canvas: canvas,
      hex: findContainingHex(grid, point),
    };
  }
  return {};
}

function mouseClicked(evt, grid, canvas) {
  if (canvas) {
    // left click
    const point = mousePosition(evt, canvas);
    if (point) {
      if (evt.button === 0) {
        return {
          type: 'SELECT',
          canvas: canvas,
          hex: findContainingHex(grid, point),
          multiple: evt.shiftKey,
        };
        // right click
      } else if (evt.button === 2) {
        return {
          type: 'DESELECT',
          canvas: canvas,
          hex: findContainingHex(grid, point),
        };
      }
    }
  }
  return {};
}
