import React from 'react';

import { TextField, Tooltip, TextFieldProps } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';

import { validate } from 'email-validator';

interface EmailFieldNewProps {
  label?: string;
  error?: boolean;
  errorTooltip?: string;
  id?: string;
  name?: string;
  autoComplete?: string;
  onBlur?: (evt: React.SyntheticEvent) => void;
  onFocus?: (evt: React.SyntheticEvent) => void;
}

type EmailFieldProps = TextFieldProps & EmailFieldNewProps;

const EmailField: React.FunctionComponent<EmailFieldProps> = ({
  error = false,
  label = 'scenes.User.EmailField.label',
  errorTooltip = '',
  id = 'email',
  name = 'email',
  autoComplete = 'email',
  onBlur = (): void => undefined,
  onFocus = (): void => undefined,
  ...props
}: EmailFieldProps) => {
  const defaultTooltip = 'scenes.User.EmailField.invalidTooltip';
  const [badEmail, setBadEmail] = React.useState(false);
  const [tooltip, setTooltip] = React.useState(defaultTooltip);

  const errorOn = error || badEmail;
  const displayTooltip = errorOn && tooltip !== '';

  // Make sure the displayed tooltip is only updated when the tooltip is
  // turned on: otherwise the tooltip can change during its close animation.
  React.useEffect(() => {
    const newTooltip = badEmail ? defaultTooltip : errorTooltip;
    if (error || badEmail) {
      setTooltip(newTooltip);
    }
  }, [error, badEmail, errorTooltip]);

  function handleBlur(evt: React.FocusEvent<HTMLInputElement>): void {
    const target = evt.target as HTMLInputElement;
    setBadEmail(!validate(target.value));
    onBlur(evt);
  }

  function handleFocus(evt: React.FocusEvent<HTMLInputElement>): void {
    setBadEmail(false);
    onFocus(evt);
  }

  return (
    <Tooltip
      title={<FormattedMessage id={tooltip} />}
      disableHoverListener
      disableFocusListener
      disableTouchListener
      open={displayTooltip}
      placement="right"
    >
      <TextField
        {...props}
        autoComplete={autoComplete}
        id={id}
        name={name}
        label={<FormattedMessage id={label} />}
        error={errorOn}
        onBlur={handleBlur}
        onFocus={handleFocus}
      />
    </Tooltip>
  );
};

export default EmailField;
