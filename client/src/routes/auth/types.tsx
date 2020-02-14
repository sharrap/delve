export interface UserInfo {
  email: string;
  password: string;
}

export interface LoginInfo extends UserInfo {
  rememberMe: boolean;
}

export type RegisterInfo = LoginInfo;
