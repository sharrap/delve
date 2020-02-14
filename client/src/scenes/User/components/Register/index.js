/*eslint no-unused-vars: ["error", { "argsIgnorePattern": "barColor" }]*/

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { actions } from 'src/redux';
import routes from 'src/routes';

import {
  Avatar,
  Container,
  Grid,
  LinearProgress,
  Link,
  Tooltip,
  Typography,
} from '@material-ui/core';

import { Alert } from '@material-ui/lab';

import { Link as RouterLink, Redirect } from 'react-router-dom';

import { FormattedMessage } from 'react-intl';

import EmailField from '../EmailField';
import PasswordField from '../PasswordField';
import LoadingButton from '../LoadingButton';

import { makeStyles, withStyles } from '@material-ui/core/styles';

import { green, grey, red, yellow } from '@material-ui/core/colors';

import {
  Info as InfoIcon,
  LockOutlined as LockOutlinedIcon,
  Warning as WarningIcon,
} from '@material-ui/icons';

import { validate } from 'email-validator';
import zxcvbn from 'zxcvbn';

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
  progressContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
  },
  loginError: {
    marginTop: theme.spacing(3),
    boxSizing: 'border-box',
    width: '100%',
  },
  iconContainer: {
    height: '24px',
    textAlign: 'right',
  },
  infoIcon: {
    color: theme.palette.info.main,
  },
  warningIcon: {
    color: theme.palette.warning.main,
  },
  passwordStrength: {
    fontWeight: 'bold',
  },
}));

const styledBy = (property, mapping) => props => mapping[props[property]];

const ColoredProgressBar = withStyles({
  colorPrimary: {
    backgroundColor: grey[300],
  },
  barColorPrimary: {
    backgroundColor: styledBy('barColor', {
      red: red[800],
      yellow: yellow[800],
      green: green[500],
      darkgreen: green[800],
      default: grey[300],
    }),
  },
})(({ barColor, ...other }) => <LinearProgress {...other} />);

function passwordTooWeak(strength) {
  return strength < 1;
}

function ColoredProgress(props) {
  const classes = useStyles();

  let color, text;

  switch (props.strength) {
    case 4:
      color = 'darkgreen';
      text = 'scenes.User.Register.passwordExcellent';
      break;
    case 3:
      color = 'green';
      text = 'scenes.User.Register.passwordStrong';
      break;
    case 2:
      color = 'yellow';
      text = 'scenes.User.Register.passwordDecent';
      break;
    case 1:
      color = 'red';
      text = 'scenes.User.Register.passwordWeak';
      break;
    case 0:
      color = 'grey';
      text = 'scenes.User.Register.passwordTooWeak';
      break;
    default:
      color = 'grey';
      text = 'scenes.User.Register.passwordUnknown';
  }

  return (
    <div className={classes.progressContainer}>
      <Grid container spacing={2}>
        <Grid item xs={10}>
          <Typography align="left" variant="caption" gutterBottom>
            <FormattedMessage id="scenes.User.Register.passwordStrength" />
          </Typography>
          <Typography
            align="left"
            variant="caption"
            fontWeight="bold"
            color={passwordTooWeak(props.strength) ? 'error' : 'textPrimary'}
            gutterBottom
            className={classes.passwordStrength}
          >
            <FormattedMessage id={text} />
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <div className={classes.iconContainer}>
            {props.warning ? (
              <Tooltip title={props.warning}>
                <WarningIcon className={classes.warningIcon} />
              </Tooltip>
            ) : null}
            {props.suggestions && props.suggestions.length ? (
              <Tooltip title={props.suggestions.join(' ')}>
                <InfoIcon className={classes.infoIcon} />
              </Tooltip>
            ) : null}
          </div>
        </Grid>
      </Grid>
      <ColoredProgressBar
        variant="determinate"
        value={Math.max(props.strength, 0) * 25}
        barColor={color}
      />
    </div>
  );
}

ColoredProgress.propTypes = {
  strength: PropTypes.number.isRequired,
  warning: PropTypes.string.isRequired,
  suggestions: PropTypes.array.isRequired,
};

function UnauthenticatedRegister({ confirmRegister }) {
  const classes = useStyles();

  const { enqueueSnackbar } = useSnackbar();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const passwordRating = password
    ? zxcvbn(password)
    : { score: -1, feedback: { warning: '', suggestions: [] } };

  const passwordStrength = passwordRating.score;
  const passwordFeedback = passwordRating.feedback;

  const [emailTaken, setEmailTaken] = React.useState(false);
  const [badPassword, setBadPassword] = React.useState(false);
  const [registerError, setRegisterError] = React.useState(false);

  const [loading, setLoading] = React.useState(false);

  function validatePassword() {
    setBadPassword(passwordTooWeak(passwordStrength));
  }

  function handleEmailChanged(evt) {
    setEmail(evt.target.value);
    setEmailTaken(false);
  }

  async function tryRegister(evt) {
    evt.preventDefault();

    setLoading(true);
    routes.auth
      .register({
        email: email,
        password: password,
      })
      .then(resp => {
        setLoading(false);
        enqueueSnackbar(
          <FormattedMessage id="scenes.User.Register.registerSuccessSnackbar" />,
          {
            variant: 'success',
          }
        );
        confirmRegister(resp.data);
      })
      .catch(err => {
        setLoading(false);
        if (err.response && err.response.status === 409) {
          setEmailTaken(true);
        } else {
          setRegisterError(true);
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
          <FormattedMessage id="scenes.User.Register.title" />
        </Typography>
        <form className={classes.form} noValidate onSubmit={tryRegister}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <EmailField
                variant="outlined"
                required
                fullWidth
                onChange={handleEmailChanged}
                value={email}
                error={emailTaken}
                errorTooltip="scenes.User.Register.emailTakenTooltip"
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
                errorTooltip="scenes.User.Register.passwordTooWeakTooltip"
              />
            </Grid>
            <Grid item xs={12}>
              <ColoredProgress
                strength={passwordStrength}
                warning={passwordFeedback.warning}
                suggestions={passwordFeedback.suggestions}
              />
            </Grid>
          </Grid>
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={passwordTooWeak(passwordStrength) || !validate(email)}
            loading={loading}
            spinnerSize={15}
            className={classes.submit}
          >
            <FormattedMessage id="scenes.User.Register.registerButton" />
          </LoadingButton>
          <Grid container>
            <Grid item xs />
            <Grid item>
              <Link component={RouterLink} to="/login" variant="body2">
                <FormattedMessage id="scenes.User.Register.loginLink" />
              </Link>
            </Grid>
          </Grid>
        </form>
        {registerError && (
          <Alert severity="error" className={classes.loginError}>
            <FormattedMessage id="scenes.User.Register.registerFailedAlert" />
          </Alert>
        )}
      </div>
    </Container>
  );
}

UnauthenticatedRegister.defaultProps = {
  confirmRegister: () => undefined,
};

UnauthenticatedRegister.propTypes = {
  confirmRegister: PropTypes.func,
};

function Register({ authenticated, ...props }) {
  return authenticated ? (
    <Redirect to="/" />
  ) : (
    <UnauthenticatedRegister {...props} />
  );
}

Register.defaultProps = {
  ...UnauthenticatedRegister.defaultProps,
  authenticated: false,
};

Register.propTypes = {
  ...UnauthenticatedRegister.propTypes,
  authenticated: PropTypes.bool,
};

function mapStateToProps({ auth }) {
  return { authenticated: auth.authenticated };
}

function register({ user }) {
  return dispatch => dispatch({ type: actions.auth.LOG_IN, user: user });
}

const actionCreators = {
  confirmRegister: register,
};

const reduxRegisterPage = connect(mapStateToProps, actionCreators)(Register);

export default reduxRegisterPage;
