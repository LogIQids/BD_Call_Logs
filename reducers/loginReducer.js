import { SAVE_LOGIN_TOKEN } from '../actions/type';

const INITIAL_STATE = {
  session_token: null,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SAVE_LOGIN_TOKEN:
      return { ...state, session_token: action.payload };
    default:
      return state;
  }
}
