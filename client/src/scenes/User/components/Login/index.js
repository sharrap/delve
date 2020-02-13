import React from 'react';

import {
  Avatar,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Typography,
} from '@material-ui/core';

import { Alert } from '@material-ui/lab';

import { Link as RouterLink } from 'react-router-dom';

import PasswordField from '../PasswordField';
import LoadingButton from '../LoadingButton';

import { makeStyles } from '@material-ui/core/styles';

import { LockOutlined as LockOutlinedIcon } from '@material-ui/icons';

import { validate } from 'email-validator';

import axios from 'axios';

const useStyles = makeStyles(theme => ({
  form: {
    marginTop: theme.spacing(1),
    width: '100%',
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  loginError: {
    marginTop: theme.spacing(3),
    boxSizing: 'border-box',
    width: '100%',
  },
  rememberMeContainer: {
    marginBottom: '2px', // For alignment with Register page
  },
}));

export default function Login() {
  const classes = useStyles();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [badEmail, setBadEmail] = React.useState(false);
  const [badPassword, setBadPassword] = React.useState(false);

  const [loading, setLoading] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);

  const [error, setError] = React.useState('');

  function validateEmail() {
    setBadEmail(!validate(email));
  }

  function validatePassword() {
    setBadPassword(!password);
  }

  async function login(evt) {
    evt.preventDefault();

    setLoading(true);
    axios
      .post('/user/signin', {
        email: email,
        password: password,
        rememberMe: rememberMe,
      })
      .then(() => {
        setLoading(false);
        console.log('todo - succ');
      })
      .catch(err => {
        setLoading(false);
        if (err.response && err.response.status === 401) {
          setError('Unrecognized email or password.');
        } else {
          setError("Sorry, we can't log you in at this time.");
        }
      });
  }

  return (
    <Container maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <form className={classes.form} noValidate onSubmit={login}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="email"
                name="email"
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                onChange={evt => setEmail(evt.target.value)}
                onBlur={validateEmail}
                onFocus={() => setBadEmail(false)}
                value={email}
                error={badEmail}
              />
            </Grid>
            <Grid item xs={12}>
              <PasswordField
                variant="outlined"
                required
                fullWidth
                onChange={evt => setPassword(evt.target.value)}
                onBlur={validatePassword}
                onFocus={() => setBadPassword(false)}
                value={password}
                error={badPassword}
                errorTooltip="Password cannot be empty."
              />
            </Grid>
          </Grid>
          <Grid container className={classes.rememberMeContainer}>
            <Grid item>
              <FormControlLabel
                control={
                  <Checkbox
                    id="rememberMe"
                    color="primary"
                    value={rememberMe}
                    onClick={() => setRememberMe(!rememberMe)}
                  />
                }
                label="Stay signed in"
              />
            </Grid>
            <Grid item xs />
          </Grid>
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={!password || !validate(email)}
            loading={loading}
            spinnerSize={15}
            className={classes.submit}
          >
            Log In
          </LoadingButton>
          <Grid container>
            <Grid item xs />
            <Grid item>
              <Link component={RouterLink} to="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
        {error !== '' && (
          <Alert severity="error" className={classes.loginError}>
            {error}
          </Alert>
        )}
      </div>
    </Container>
  );
}
