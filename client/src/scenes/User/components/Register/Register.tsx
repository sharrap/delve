/*eslint no-unused-vars: ["error", { "argsIgnorePattern": "barColor" }]*/

import React from 'react';

import {
  Avatar,
  Container,
  Grid,
  LinearProgress,
  LinearProgressProps,
  Link,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Link as RouterLink, Redirect } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import {
  Info as InfoIcon,
  LockOutlined as LockOutlinedIcon,
  Warning as WarningIcon,
} from '@material-ui/icons';

import EmailField from '../EmailField';
import PasswordField from '../PasswordField';
import LoadingButton from '../LoadingButton';

import { createStyles } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { green, grey, red, yellow } from '@material-ui/core/colors';

import { validate } from 'email-validator';
import zxcvbn from 'zxcvbn';

import {
  useAuthenticated,
  useAuthentication,
} from 'src/components/AuthenticationProvider';

import { RegisterInfo, User } from 'src/types/auth';

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

type ColoredProgressBarProps = LinearProgressProps & { barColor: string };

const styledBy = (mapping: { [key: string]: string }) => (
  props: ColoredProgressBarProps
): string => mapping[props.barColor];

const coloredProgressBarStyles = createStyles({
  colorPrimary: {
    backgroundColor: grey[300],
  },
  barColorPrimary: {
    backgroundColor: styledBy({
      red: red[800],
      yellow: yellow[800],
      green: green[500],
      darkgreen: green[800],
      default: grey[300],
    }),
  },
});

const ColoredProgressBar = withStyles(
  coloredProgressBarStyles
)(({ barColor, ...other }: ColoredProgressBarProps) => (
  <LinearProgress {...other} />
));

function passwordTooWeak(strength: number): boolean {
  return strength < 1;
}

interface ColoredProgressProps {
  strength?: number;
  warning?: string;
  suggestions?: Array<string>;
}

const ColoredProgress: React.FunctionComponent<ColoredProgressProps> = ({
  strength = 0,
  warning = '',
  suggestions = [],
}: ColoredProgressProps) => {
  const classes = useStyles();

  let color, text;

  switch (strength) {
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
            color={passwordTooWeak(strength) ? 'error' : 'textPrimary'}
            gutterBottom
            className={classes.passwordStrength}
          >
            <FormattedMessage id={text} />
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <div className={classes.iconContainer}>
            {warning ? (
              <Tooltip title={warning}>
                <WarningIcon className={classes.warningIcon} />
              </Tooltip>
            ) : null}
            {suggestions && suggestions.length ? (
              <Tooltip title={suggestions.join(' ')}>
                <InfoIcon className={classes.infoIcon} />
              </Tooltip>
            ) : null}
          </div>
        </Grid>
      </Grid>
      <ColoredProgressBar
        variant="determinate"
        value={Math.max(strength, 0) * 25}
        barColor={color}
      />
    </div>
  );
};

interface UnauthenticatedRegisterProps {
  register?: (info: RegisterInfo) => Promise<User>;
}

const UnauthenticatedRegister: React.FunctionComponent<UnauthenticatedRegisterProps> = ({
  register = (): Promise<User> =>
    new Promise((_, reject) => reject(new Error('crash'))),
}: UnauthenticatedRegisterProps) => {
  const classes = useStyles();

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

  function validatePassword(): void {
    setBadPassword(passwordTooWeak(passwordStrength));
  }

  function handleEmailChanged(evt: React.ChangeEvent<HTMLInputElement>): void {
    const target = evt.target as HTMLInputElement;
    setEmail(target.value);
    setEmailTaken(false);
  }

  function tryRegister(evt: React.SyntheticEvent): void {
    evt.preventDefault();

    setLoading(true);
    register({ email: email, password: password }).catch(err => {
      setLoading(false);
      if (err === 'email-taken') {
        setEmailTaken(true);
      } else {
        setRegisterError(true);
      }
    });
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
                errorTooltip={
                  <FormattedMessage id="scenes.User.Register.emailTakenTooltip" />
                }
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
                  <FormattedMessage id="scenes.User.Register.passwordTooWeakTooltip" />
                }
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
};

type RegisterProps = UnauthenticatedRegisterProps & {
  authenticated?: boolean;
};

export const Register: React.FunctionComponent<RegisterProps> = ({
  authenticated = false,
  ...props
}: RegisterProps) => {
  return authenticated ? (
    <Redirect to="/" />
  ) : (
    <UnauthenticatedRegister {...props} />
  );
};

const ConnectedRegister: React.FunctionComponent = () => {
  const { register } = useAuthentication();
  const authenticated = useAuthenticated();

  return <Register authenticated={authenticated} register={register} />;
};

export default ConnectedRegister;
