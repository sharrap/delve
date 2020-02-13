import React from 'react';

import {
  Avatar,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Typography,
} from '@material-ui/core';

import { Link as RouterLink } from 'react-router-dom';

import PasswordField from '../../components/PasswordField';

import { makeStyles } from '@material-ui/core/styles';

import { LockOutlined as LockOutlinedIcon } from '@material-ui/icons';

import { validate } from 'email-validator';

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

  function validateEmail() {
    setBadEmail(!validate(email));
  }

  function validatePassword() {
    setBadPassword(!password);
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
        <form
          className={classes.form}
          noValidate
          action="/user/signin"
          method="post"
        >
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
                autoComplete="current-password"
                name="password"
                variant="outlined"
                required
                fullWidth
                id="password"
                label="Password"
                onChange={evt => setPassword(evt.target.value)}
                onBlur={validatePassword}
                onFocus={() => setBadPassword(false)}
                value={password}
                error={badPassword}
              />
            </Grid>
          </Grid>
          <Grid container className={classes.rememberMeContainer}>
            <Grid item>
              <FormControlLabel
                control={<Checkbox value="rememberMe" color="primary" />}
                label="Stay signed in"
              />
            </Grid>
            <Grid item xs />
          </Grid>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            disabled={!password || !validate(email)}
            className={classes.submit}
          >
            Log In
          </Button>
          <Grid container>
            <Grid item xs />
            <Grid item>
              <Link component={RouterLink} to="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
