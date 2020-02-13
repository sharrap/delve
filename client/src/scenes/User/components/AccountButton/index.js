import React from 'react';

import { IconButton } from '@material-ui/core';

import { AccountCircle as AccountIcon } from '@material-ui/icons';

export default function AccountButton() {
  return (
    <IconButton>
      <AccountIcon />
    </IconButton>
  );
}
