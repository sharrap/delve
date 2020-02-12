import React from 'react';

import {
  Avatar,
  Button,
  Container,
  Grid,
  Link,
  TextField,
} from '@material-ui/core';

import { Link as RouterLink } from 'react-router-dom';

import PasswordField from '../../components/PasswordField';

import { makeStyles } from '@material-ui/core/styles';

import { LockOutlined as LockOutlinedIcon } from '@material-ui/icons';

import { validate } from 'email-validator';

const useStyles = makeStyles(theme => ({
  form: {
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
  progressContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
}));

export default function Login() {
  const classes = useStyles();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <Container maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
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
                value={email}
                onChange={evt => setEmail(evt.target.value)}
                error={!validate(email)}
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
                error={!password}
                onChange={evt => setPassword(evt.target.value)}
                value={password}
              />
            </Grid>
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
