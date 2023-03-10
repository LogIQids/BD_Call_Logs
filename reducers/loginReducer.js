import {SAVE_LOGIN_TOKEN, RESET_LOGIN_TOKEN} from '../actions/type';

const INITIAL_STATE = null;

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SAVE_LOGIN_TOKEN:
      return action.payload;
    case RESET_LOGIN_TOKEN:
      return INITIAL_STATE;
    default:
      return state;
  }
}
