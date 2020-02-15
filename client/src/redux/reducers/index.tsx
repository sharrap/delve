import { combineReducers } from 'redux';
import {
  actions as authActions,
  reducer as authReducer,
  Action as _AuthAction,
  State as _AuthState,
  User as _AuthUser,
} from './auth';

export type AuthAction = _AuthAction;
export type AuthState = _AuthState;
export type AuthUser = _AuthUser;

export const rootReducer = combineReducers({ auth: authReducer });

export const actions = {
  auth: authActions,
};

export interface State {
  auth: AuthState;
}
