import {SAVE_PHONE_NUMBER, RESET_PHONE_NUMBER} from './type';

export function saveData(userData) {
  return {type: SAVE_PHONE_NUMBER, payload: userData};
}
export function resetData() {
  return {type: RESET_PHONE_NUMBER};
}
