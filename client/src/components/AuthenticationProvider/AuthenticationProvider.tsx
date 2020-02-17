import React from 'react';
import { useSnackbar } from 'notistack';

import { FormattedMessage } from 'react-intl';

import { actions, useSelector, useDispatch } from 'src/redux';
import { LoginInfo, RegisterInfo, User } from 'src/types/auth';
import routes from 'src/routes';

interface AuthenticationProviderProps {
  mock?: boolean;
  children: React.ReactNode;
}

export interface Authentication {
  login: (info: LoginInfo, notify?: boolean) => Promise<User>;
  register: (info: RegisterInfo, notify?: boolean) => Promise<User>;
  logout: (notify?: boolean) => Promise<undefined>;
  loggedIn: (notify?: boolean) => Promise<User>;
}

const AuthenticationContext = React.createContext<Authentication>({
  login: () => Promise.reject('unimplemented'),
  logout: () => Promise.reject('unimplemented'),
  loggedIn: () => Promise.reject('unimplemented'),
  register: () => Promise.reject('unimplemented'),
});

export function useAuthenticated(): boolean {
  return useSelector(state => state.auth.authenticated);
}

export function useUser(): User | null {
  return useSelector(state => state.auth.user) || null;
}

export function useAuthentication(): Authentication {
  return React.useContext(AuthenticationContext);
}

type Variant = 'success' | 'error';

export const AuthenticationProvider: React.FunctionComponent<AuthenticationProviderProps> = ({
  mock = false,
  children,
}: AuthenticationProviderProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const snackbar = (suffix: string, variant: Variant): void => {
    enqueueSnackbar(<FormattedMessage id={'notifications.Auth.' + suffix} />, {
      variant: variant,
    });
  };

  const auth = mock ? routes.auth.mock : routes.auth.rest;

  async function login(info: LoginInfo, notify = true): Promise<User> {
    let message = 'loginError',
      variant: Variant = 'error';
    try {
      const user = await auth.login(info);

      message = 'loginSuccess';
      variant = 'success';
      dispatch({ type: actions.auth.LOG_IN, user: user });

      return user;
    } catch (err) {
      dispatch({ type: actions.auth.LOG_OUT });

      if (err.reason === 'login-failed') {
        message = 'loginFail';
      }

      throw err;
    } finally {
      if (notify) {
        snackbar(message, variant);
      }
    }
  }

  async function register(info: RegisterInfo, notify = true): Promise<User> {
    let message = 'registerError',
      variant: Variant = 'error';
    try {
      const user = await auth.register(info);

      message = 'registerSuccess';
      variant = 'success';

      dispatch({ type: actions.auth.LOG_IN, user: user });

      return user;
    } catch (err) {
      dispatch({ type: actions.auth.LOG_OUT });

      if (err.reason === 'email-taken') {
        message = 'registerFail';
      }

      throw err;
    } finally {
      if (notify) {
        snackbar(message, variant);
      }
    }
  }

  async function logout(notify = true): Promise<undefined> {
    let message = 'logoutError',
      variant: Variant = 'error';
    try {
      const resp = await auth.logout();

      message = 'logoutSuccess';
      variant = 'success';

      dispatch({ type: actions.auth.LOG_OUT });

      return resp;
    } finally {
      if (notify) {
        snackbar(message, variant);
      }
    }
  }

  async function loggedIn(notify = true): Promise<User> {
    const user = await auth.loggedIn();

    if (notify) {
      snackbar('loggedInSuccess', 'success');
    }

    return user;
  }

  const value = {
    login: login,
    logout: logout,
    loggedIn: loggedIn,
    register: register,
  };

  return (
    <AuthenticationContext.Provider value={value}>
      {children}
    </AuthenticationContext.Provider>
  );
};
