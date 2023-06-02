import {SAVE_PHONE_NUMBER, RESET_PHONE_NUMBER} from '../actions/type';

const INITIAL_STATE = null;

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SAVE_PHONE_NUMBER:
      return action.payload;
    case RESET_PHONE_NUMBER:
      return INITIAL_STATE;
    default:
      return state;
  }
}
