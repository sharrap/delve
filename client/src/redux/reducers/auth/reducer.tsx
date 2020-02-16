import { actions } from './actions';
import { Action, State } from './types';

export default function reduce(
  state: State = { authenticated: false },
  action: Action
): State {
  switch (action.type) {
    case actions.LOG_IN:
      return {
        authenticated: true,
        user: action.user,
      };
    case actions.LOG_OUT:
      return {
        authenticated: false,
        user: undefined,
      };
    default:
      return state;
  }
}
