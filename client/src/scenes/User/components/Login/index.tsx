import React from 'react';
import * as Redux from 'react-redux';

import { actions, RootState, ThunkDispatch } from 'src/redux';
import routes from 'src/routes';

import {
  Avatar,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Link,
  Typography,
} from '@material-ui/core';

import { Alert } from '@material-ui/lab';

import { Link as RouterLink, Redirect } from 'react-router-dom';

import { FormattedMessage } from 'react-intl';

import EmailField from '../EmailField';
import PasswordField from '../PasswordField';
import LoadingButton from '../LoadingButton';

import { makeStyles } from '@material-ui/core/styles';

import { LockOutlined as LockOutlinedIcon } from '@material-ui/icons';

import { validate } from 'email-validator';

import { useSnackbar } from 'notistack';

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

const UnauthenticatedLogin: React.FunctionComponent = () => {
  const classes = useStyles();

  const dispatch = Redux.useDispatch<ThunkDispatch>();

  const { enqueueSnackbar } = useSnackbar();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [badPassword, setBadPassword] = React.useState(false);

  const [loading, setLoading] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);

  const [error, setError] = React.useState('');

  function validatePassword(): void {
    setBadPassword(!password);
  }

  function login(evt: React.SyntheticEvent): void {
    evt.preventDefault();

    setLoading(true);
    routes.auth
      .login({
        email: email,
        password: password,
        rememberMe: rememberMe,
      })
      .then(resp => {
        setLoading(false);
        enqueueSnackbar(
          <FormattedMessage id="scenes.User.Login.loginSuccessSnackbar" />,
          { variant: 'success' }
        );
        dispatch({ type: actions.auth.LOG_IN, user: resp.data.user });
      })
      .catch(err => {
        setLoading(false);
        if (err.response && err.response.status === 403) {
          setError('scenes.User.Login.loginRejectedAlert');
        } else {
          setError('scenes.User.Login.loginFailedAlert');
        }
      });
  }

  function handleEmailChange(evt: React.ChangeEvent<HTMLInputElement>): void {
    const target = evt.target as HTMLInputElement;
    setEmail(target.value);
  }

  function handlePasswordChange(
    evt: React.ChangeEvent<HTMLInputElement>
  ): void {
    const target = evt.target as HTMLInputElement;
    setPassword(target.value);
  }

  return (
    <Container maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          <FormattedMessage id="scenes.User.Login.title" />
        </Typography>
        <form className={classes.form} noValidate onSubmit={login}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <EmailField
                variant="outlined"
                required
                fullWidth
                onChange={handleEmailChange}
                value={email}
              />
            </Grid>
            <Grid item xs={12}>
              <PasswordField
                variant="outlined"
                required
                fullWidth
                onChange={handlePasswordChange}
                onBlur={validatePassword}
                onFocus={(): void => setBadPassword(false)}
                value={password}
                error={badPassword}
                errorTooltip={
                  <FormattedMessage id="scenes.User.Login.emptyPasswordTooltip" />
                }
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
                    onClick={(): void => setRememberMe(!rememberMe)}
                  />
                }
                label={
                  <FormattedMessage id="scenes.User.Login.rememberMeCheckbox" />
                }
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
            <FormattedMessage id="scenes.User.Login.loginButton" />
          </LoadingButton>
          <Grid container>
            <Grid item xs />
            <Grid item>
              <Link component={RouterLink} to="/register" variant="body2">
                <FormattedMessage id="scenes.User.Login.registerLink" />
              </Link>
            </Grid>
          </Grid>
        </form>
        {error !== '' && (
          <Alert severity="error" className={classes.loginError}>
            <FormattedMessage id={error} />
          </Alert>
        )}
      </div>
    </Container>
  );
};

const Login: React.FunctionComponent = () => {
  const authenticated = Redux.useSelector<RootState>(
    state => state.auth.authenticated
  );
  return authenticated ? <Redirect to="/" /> : <UnauthenticatedLogin />;
};

export default Login;
