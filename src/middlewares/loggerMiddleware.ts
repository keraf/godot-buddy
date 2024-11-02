import { startAppListening } from './listenerMiddleware';

startAppListening({
  predicate: (action, currentState, previousState) => {
    console.group(action.type);
    console.info('dispatching', action);
    console.log('prev state', previousState);
    console.log('next state', currentState);
    console.groupEnd();
    return true;
  },
  effect: () => {},
});
