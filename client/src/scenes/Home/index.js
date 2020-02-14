import React from 'react';

import './Home.css';

import { Typography } from '@material-ui/core';

import { ReactComponent as HexGrid } from './hex.svg';

import { FormattedMessage } from 'react-intl';

export default function Home() {
  return (
    <div className="Home">
      <HexGrid />
      <Typography variant="h1">
        <FormattedMessage id="scenes.Home.title" />
      </Typography>
    </div>
  );
}
