import React from 'react';

import zxcvbn from 'zxcvbn';

import {
  Avatar,
  Button,
  Container,
  Grid,
  LinearProgress,
  TextField,
  Typography,
} from '@material-ui/core';

import PasswordField from '../../components/PasswordField';

import { makeStyles, withStyles } from '@material-ui/core/styles';

import { green, grey, red, yellow } from '@material-ui/core/colors';

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

function ColouredProgress(props) {
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
      <Typography
        align="left"
        variant="caption"
        color={passwordTooWeak(props.strength) ? 'error' : 'textPrimary'}
        gutterBottom
      >
        Password Strength:
        <strong>{' ' + text}</strong>
      </Typography>
      <ColoredProgressBar
        variant="determinate"
        value={Math.max(props.strength, 0) * 25}
        barColor={color}
      />
    </div>
  );
}

export default function Register() {
  const classes = useStyles();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [passwordStrength, setPasswordStrength] = React.useState(-1);

  React.useEffect(() => {
    if (!password || password === '') {
      setPasswordStrength(-1);
    } else {
      const { score } = zxcvbn(password);
      setPasswordStrength(score);
    }
  }, [password]);

  return (
    <Container maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <form
          className={classes.form}
          noValidate
          action="/user/signup"
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
                error={passwordStrength < 2}
                label="Password"
                onChange={evt => setPassword(evt.target.value)}
                value={password}
              />
            </Grid>
            <Grid item xs={12}>
              <ColouredProgress strength={passwordStrength} />
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
        </form>
      </div>
    </Container>
  );
}
