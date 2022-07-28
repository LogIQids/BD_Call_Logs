import {SAVE_LOGIN_TOKEN} from './type';
export function handlelogin(userData) {
  console.log('here trying');
  return {type: SAVE_LOGIN_TOKEN, payload: userData};

  // const url = LOGIN;
  // return api
  //   .post(url, userData, httpReq)
  //   .then(response => {
  //     if (response.status === 200 && response.data && response.data.data) {
  //       setAuthorizationToken(response.data.data);
  //       dispatch({
  //         type: SAVE_LOGIN_TOKEN,
  //         payload: response.data.data,
  //       });
  //     }
  //     return Promise.resolve();
  //   })
  //   .catch(error => {
  //     return Promise.reject(error);
  //   });
}
