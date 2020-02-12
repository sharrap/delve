import React from 'react';

import { IconButton, InputAdornment, TextField } from '@material-ui/core';

import {
  VisibilityOff as VisibilityOffIcon,
  Visibility as VisibilityOnIcon,
} from '@material-ui/icons';

export default function PasswordField(props) {
  const [passwordVisible, setPasswordVisible] = React.useState(false);

  return (
    <TextField
      {...props}
      type={passwordVisible ? 'text' : 'password'}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <VisibilityOnIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
