import React from 'react';
import PropTypes from 'prop-types';

import { TextField, Tooltip } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';

import { validate } from 'email-validator';

export default function EmailField({
  error,
  label,
  errorTooltip,
  id,
  name,
  autoComplete,
  onBlur,
  onFocus,
  ...props
}) {
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

  function handleBlur(evt) {
    setBadEmail(!validate(evt.target.value));
    onBlur(evt);
  }

  function handleFocus(evt) {
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
}

EmailField.propTypes = {
  error: PropTypes.bool,
  errorTooltip: PropTypes.string,
  label: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  autoComplete: PropTypes.string,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
};

EmailField.defaultProps = {
  error: false,
  errorTooltip: '',
  label: 'scenes.User.EmailField.label',
  id: 'email',
  name: 'email',
  autoComplete: 'email',
  onBlur: () => undefined,
  onFocus: () => undefined,
};
