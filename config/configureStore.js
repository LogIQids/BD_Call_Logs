import rootReducer from '../reducers';
import { applyMiddleware, compose, createStore } from 'redux';

const configureStore = () => {
  return createStore(rootReducer);
};
export default configureStore;
