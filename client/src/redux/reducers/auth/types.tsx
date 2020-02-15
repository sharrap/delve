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

export interface State {
  authenticated: boolean;
  user?: User;
}
