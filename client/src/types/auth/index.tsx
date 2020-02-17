export interface User {
  email: string;
}

// Routes
export interface RegisterInfo {
  email: string;
  password: string;
}

export interface LoginInfo {
  email: string;
  password: string;
  rememberMe: boolean;
}

// Redux
interface LogInAction {
  type: string;
  user: User;
}

interface LogOutAction {
  type: string;
  user?: User;
}

export type Action = LogInAction | LogOutAction;

export interface State {
  authenticated: boolean;
  user?: User;
}
