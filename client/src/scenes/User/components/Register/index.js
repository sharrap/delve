/*eslint no-unused-vars: ["error", { "argsIgnorePattern": "barColor" }]*/

import React from 'react';
import PropTypes from 'prop-types';

import axios from 'axios';

import {
  Avatar,
  Button,
  Container,
  Grid,
  LinearProgress,
  Link,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';

import { Link as RouterLink } from 'react-router-dom';

import PasswordField from '../PasswordField';

import { makeStyles, withStyles } from '@material-ui/core/styles';

import { green, grey, red, yellow } from '@material-ui/core/colors';

import {
  Info as InfoIcon,
  LockOutlined as LockOutlinedIcon,
  Warning as WarningIcon,
} from '@material-ui/icons';

import zxcvbn from 'zxcvbn';
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
  progressContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
  },
  iconContainer: {
    height: '24px',
    textAlign: 'right',
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
      text = 'Excellent';
      break;
    case 3:
      color = 'green';
      text = 'Strong';
      break;
    case 2:
      color = 'yellow';
      text = 'Decent';
      break;
    case 1:
      color = 'red';
      text = 'Weak';
      break;
    case 0:
      color = 'grey';
      text = 'Too Weak';
      break;
    default:
      color = 'grey';
      text = 'Unknown';
  }

  return (
    <div className={classes.progressContainer}>
      <Grid container spacing={2}>
        <Grid item xs={10}>
          <Typography align="left" variant="caption" gutterBottom>
            {'Password Strength: '}
          </Typography>
          <Typography
            align="left"
            variant="caption"
            fontWeight="bold"
            color={passwordTooWeak(props.strength) ? 'error' : 'textPrimary'}
            gutterBottom
            className={classes.passwordStrength}
          >
            {text}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <div className={classes.iconContainer}>
            {props.warning ? (
              <Tooltip title={props.warning}>
                <WarningIcon color="error" />
              </Tooltip>
            ) : null}
            {props.suggestions && props.suggestions.length ? (
              <Tooltip title={props.suggestions.join(' ')}>
                <InfoIcon color="action" />
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

export default function Register() {
  const classes = useStyles();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const passwordRating = password
    ? zxcvbn(password)
    : { score: -1, feedback: { warning: '', suggestions: [] } };

  const passwordStrength = passwordRating.score;
  const passwordFeedback = passwordRating.feedback;

  const [badEmail, setBadEmail] = React.useState(false);
  const [badPassword, setBadPassword] = React.useState(false);

  function validateEmail() {
    setBadEmail(!validate(email));
  }

  function validatePassword() {
    setBadPassword(passwordTooWeak(passwordStrength));
  }

  function register(evt) {
    evt.preventDefault();

    axios
      .post('/user/signup', {
        email: email,
        password: password,
      })
      .then(resp => console.log(resp))
      .catch(err => console.log(err));
  }

  return (
    <Container maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <form className={classes.form} noValidate onSubmit={register}>
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
            <Grid item xs={12}>
              <ColoredProgress
                strength={passwordStrength}
                warning={passwordFeedback.warning}
                suggestions={passwordFeedback.suggestions}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={passwordTooWeak(passwordStrength) || !validate(email)}
            className={classes.submit}
          >
            Register
          </Button>
          <Grid container>
            <Grid item xs />
            <Grid item>
              <Link component={RouterLink} to="/login" variant="body2">
                Already have an account? Sign In
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
