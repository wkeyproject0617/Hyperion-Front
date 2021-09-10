import tokenData from '../../../commons/test/token';

const CHANGE_TOKEN_INFO = 'token/CHANGE_TOKEN_INFO';

export const changeToken = (token) => ({ type: CHANGE_TOKEN_INFO, token });

// const initialState = window.localStorage.getItem('accessToken');
const initialState = tokenData.data.access_token;

export default function token(state = initialState, action) {
  switch (action.type) {
    case CHANGE_TOKEN_INFO:
      return action.token;

    default:
      return state;
  }
}
