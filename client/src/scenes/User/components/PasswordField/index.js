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
  onFocus,
  onBlur,
  ...props
}) {
  const [passwordVisible, setPasswordVisible] = React.useState(false);

  const [capsLock, setCapsLock] = React.useState(false);
  const [focus, setFocus] = React.useState(false);

  const capsLockTooltip = 'Caps Lock is enabled';

  const [displayCapsLockTooltip, setDisplayCapsLockTooltip] = React.useState(
    false
  );

  const errorOn = error && errorTooltip !== '';
  const displayTooltip = errorOn || (capsLock && focus);

  React.useEffect(() => {
    // We only want to disable tooltips in the event that the other tooltip is
    // enabled. This is because if the tooltip is already closing (thanks to
    // only one tooltip entry being on) it will look strange when closing if we
    // turn off that one entry.
    if (errorOn || capsLock) {
      setDisplayCapsLockTooltip(capsLock && focus);
    }
  }, [capsLock, errorOn, focus]);

  function updateCapsLock(evt) {
    setCapsLock(evt.getModifierState('CapsLock'));
  }

  function handleFocus(evt) {
    setFocus(true);
    onFocus(evt);
  }

  function handleBlur(evt) {
    setFocus(false);
    onBlur(evt);
  }

  React.useEffect(() => {
    // The caps lock key itself registers as down when enabled and up when
    // disabled, so we need to check both to catch both that key and any
    // other keys being pressed when caps lock is on.
    window.addEventListener('keydown', updateCapsLock);
    window.addEventListener('keyup', updateCapsLock);
    return () => {
      window.removeEventListener('keydown', updateCapsLock);
      window.removeEventListener('keyup', updateCapsLock);
    };
  }, []);

  return (
    <Tooltip
      title={displayCapsLockTooltip ? capsLockTooltip : errorTooltip}
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
        onFocus={handleFocus}
        onBlur={handleBlur}
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
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

PasswordField.defaultProps = {
  error: false,
  errorTooltip: '',
  label: 'Password',
  id: 'password',
  name: 'password',
  autoComplete: 'current-password',
  onFocus: () => undefined,
  onBlur: () => undefined,
};
