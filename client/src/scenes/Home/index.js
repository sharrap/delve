import React from 'react';

import './Home.css';

import { Typography } from '@material-ui/core';

import { ReactComponent as HexGrid } from './hex.svg';

export default class Home extends React.PureComponent {
  render() {
    return (
      <div className="Home">
        <HexGrid />
        <Typography variant="h1">Delve</Typography>
      </div>
    );
  }
}
