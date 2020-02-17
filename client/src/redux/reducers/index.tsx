import { combineReducers, Action } from 'redux';
import {
  ThunkAction as ReduxThunkAction,
  ThunkDispatch as ReduxThunkDispatch,
} from 'redux-thunk';
import { actions as authActions, reducer as authReducer } from './auth';

export const rootReducer = combineReducers({ auth: authReducer });

export const actions = {
  auth: authActions,
};

export type State = ReturnType<typeof rootReducer>;
export type ThunkAction<R> = ReduxThunkAction<
  R,
  State,
  unknown,
  Action<string>
>;
export type ThunkDispatch = ReduxThunkDispatch<State, unknown, Action<string>>;
