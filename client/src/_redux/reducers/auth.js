import actions from '../actions/';

export default function reduce(state = {}, action) {
  switch (action.type) {
    case actions.auth.LOG_IN:
      return {
        authenticated: true,
        user: action.user,
      };
    case actions.auth.LOG_OUT:
      return {
        authenticated: false,
        user: undefined,
      };
    default:
      return state;
  }
}
