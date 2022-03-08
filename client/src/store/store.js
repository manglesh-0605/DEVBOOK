import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';

//The initial state of the store
const initlaState = {};
const middleware = [thunk];

const store = createStore(
  rootReducer,
  initlaState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
