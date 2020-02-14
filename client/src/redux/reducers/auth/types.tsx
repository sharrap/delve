import { actions } from './actions';

export interface User {
  email: string;
}

interface LogIn {
  type: typeof actions.LOG_IN;
  user: User;
}

interface LogOut {
  type: typeof actions.LOG_OUT;
}

export type Action = LogIn | LogOut;

interface LoggedIn {
  authenticated: boolean;
  user: User;
}

interface LoggedOut {
  authenticated: boolean;
}

export type State = LoggedIn | LoggedOut;
