import React from 'react';

import { Button, CircularProgress, Grid } from '@material-ui/core';

interface LoadingButtonProps {
  loading: boolean;
  disabled: boolean;
  children: React.ReactNode;
  spinnerSize: number;
}

const LoadingButton: React.SFC<LoadingButtonProps> = ({
  loading,
  disabled,
  spinnerSize,
  children,
  ...props
}: LoadingButtonProps) => {
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
};

LoadingButton.defaultProps = {
  loading: false,
  disabled: false,
  spinnerSize: 15,
  children: null,
};

export default LoadingButton;
