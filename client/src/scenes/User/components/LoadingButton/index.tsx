import React from 'react';

import { Button, ButtonProps, CircularProgress, Grid } from '@material-ui/core';

interface LoadingButtonNewProps {
  loading?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  spinnerSize?: number;
}

type LoadingButtonProps = ButtonProps & LoadingButtonNewProps;

const LoadingButton: React.SFC<LoadingButtonProps> = ({
  loading = false,
  disabled = false,
  spinnerSize = 15,
  children = null,
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

export default LoadingButton;
