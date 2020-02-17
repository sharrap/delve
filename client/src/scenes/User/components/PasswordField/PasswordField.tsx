import React from 'react';

import {
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
  Tooltip,
} from '@material-ui/core';

import {
  VisibilityOff as VisibilityOffIcon,
  Visibility as VisibilityOnIcon,
} from '@material-ui/icons';

import { FormattedMessage } from 'react-intl';

interface PasswordFieldNewProps {
  autoComplete?: string;
  name?: string;
  id?: string;
  label?: string;
  error?: boolean;
  errorTooltip?: React.ReactNode;
  onFocus?: (evt: React.SyntheticEvent) => void;
  onBlur?: (evt: React.SyntheticEvent) => void;
}

type PasswordFieldProps = TextFieldProps & PasswordFieldNewProps;

const PasswordField: React.FunctionComponent<PasswordFieldProps> = ({
  autoComplete = 'current-password',
  name = 'password',
  id = 'password',
  label = 'scenes.User.PasswordField.label',
  error = false,
  errorTooltip = '',
  onFocus = (): void => undefined,
  onBlur = (): void => undefined,
  ...props
}: PasswordFieldProps) => {
  const [passwordVisible, setPasswordVisible] = React.useState(false);

  const [capsLock, setCapsLock] = React.useState(false);
  const [focus, setFocus] = React.useState(false);

  const capsLockTooltip = (
    <FormattedMessage id="scenes.User.PasswordField.capsLockTooltip" />
  );

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

  function handleFocus(evt: React.SyntheticEvent): void {
    setFocus(true);
    onFocus(evt);
  }

  function handleBlur(evt: React.SyntheticEvent): void {
    setFocus(false);
    onBlur(evt);
  }

  React.useEffect(() => {
    function updateCapsLock(evt: KeyboardEvent): boolean | null {
      const IS_MAC = /Mac/.test(navigator.platform);

      const charCode = evt.charCode;
      const shiftKey = evt.shiftKey;

      if (charCode >= 97 && charCode <= 122) {
        return shiftKey;
      } else if (charCode >= 65 && charCode <= 90 && !(shiftKey && IS_MAC)) {
        return !shiftKey;
      }

      return null;
    }

    function handleKeyPress(evt: KeyboardEvent): void {
      const newValue = updateCapsLock(evt);
      if (newValue || newValue === false) setCapsLock(newValue);
    }

    // The caps lock key itself registers as down when enabled and up when
    // disabled, so we need to check both to catch both that key and any
    // other keys being pressed when caps lock is on.
    window.addEventListener('keypress', handleKeyPress);
    return (): void => {
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, []);

  return (
    <Tooltip
      title={
        <span data-testid="password-field-error-tooltip">
          {(!displayCapsLockTooltip && errorTooltip) || capsLockTooltip}
        </span>
      }
      disableHoverListener
      disableFocusListener
      disableTouchListener
      open={displayTooltip}
      placement="right"
    >
      <TextField
        {...props}
        data-testid="password-field"
        id={id}
        name={name}
        autoComplete={autoComplete}
        label={<FormattedMessage id={label} />}
        type={passwordVisible ? 'text' : 'password'}
        error={error}
        onFocus={handleFocus}
        onBlur={handleBlur}
        InputProps={{
          inputProps: { 'data-testid': 'password-field-input' },
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                data-testid="password-field-visibility-button"
                onClick={(): void => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? (
                  <VisibilityOnIcon data-testid="password-field-visibility-on" />
                ) : (
                  <VisibilityOffIcon data-testid="password-field-visibility-off" />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Tooltip>
  );
};

export default PasswordField;
