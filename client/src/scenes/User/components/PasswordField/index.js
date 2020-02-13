import React from 'react';
import PropTypes from 'prop-types';

import {
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from '@material-ui/core';

import {
  VisibilityOff as VisibilityOffIcon,
  Visibility as VisibilityOnIcon,
} from '@material-ui/icons';

export default function PasswordField({
  autoComplete,
  name,
  id,
  label,
  error,
  errorTooltip,
  ...props
}) {
  const [passwordVisible, setPasswordVisible] = React.useState(false);

  const displayTooltip = error && errorTooltip !== '';

  return (
    <Tooltip
      title={errorTooltip}
      disableHoverListener
      disableFocusListener
      disableTouchListener
      open={displayTooltip}
      placement="right"
    >
      <TextField
        {...props}
        id={id}
        name={name}
        autoComplete={autoComplete}
        label={label}
        type={passwordVisible ? 'text' : 'password'}
        error={error}
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
    </Tooltip>
  );
}

PasswordField.propTypes = {
  error: PropTypes.bool,
  errorTooltip: PropTypes.string,
  label: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  autoComplete: PropTypes.string,
};

PasswordField.defaultProps = {
  error: false,
  errorTooltip: '',
  label: 'Password',
  id: 'password',
  name: 'password',
  autoComplete: 'current-password',
};
