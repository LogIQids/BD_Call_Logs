import {SAVE_LOGIN_TOKEN,RESET_LOGIN_TOKEN} from './type';

export function handlelogin(userData) {
  return {type: SAVE_LOGIN_TOKEN, payload: userData};
}
export function resetLogin() {
  return {type: RESET_LOGIN_TOKEN};
}
