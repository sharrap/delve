import React from 'react';
import PropTypes from 'prop-types';

import { Button, CircularProgress, Grid } from '@material-ui/core';

export default function LoadingButton({
  loading,
  disabled,
  spinnerSize,
  children,
  ...props
}) {
  return (
    <Button {...props} disabled={loading || disabled}>
      <Grid container>
        <Grid item xs={1} />
        <Grid item xs={10}>
          {children}
        </Grid>
        <Grid item xs={1}>
          {loading && <CircularProgress size={spinnerSize} />}
        </Grid>
      </Grid>
    </Button>
  );
}

LoadingButton.propTypes = {
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  children: PropTypes.node,
  spinnerSize: PropTypes.number,
};

LoadingButton.defaultProps = {
  loading: false,
  disabled: false,
  spinnerSize: 15,
  children: null,
};
