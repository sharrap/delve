import {
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
  TypedUseSelectorHook,
} from 'react-redux';
import * as reducers from './reducers';
import store from './store';

export { actions } from './reducers';

export type RootState = reducers.State;
export type ThunkAction<R> = reducers.ThunkAction<R>;
export type ThunkDispatch = reducers.ThunkDispatch;

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
export function useDispatch(): typeof store.dispatch {
  return useReduxDispatch();
}
export { store };
