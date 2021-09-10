import tokenData from '../../../commons/test/token';

const CHANGE_REFRESH_TOKEN_INFO = 'refreshToken/CHANGE_REFRESH_TOKEN_INFO';

export const changeRefreshToken = (refreshToken) => ({ type: CHANGE_REFRESH_TOKEN_INFO, refreshToken });

// const initialState = window.localStorage.getItem('accessToken');
const initialState = tokenData.data.refresh_token;

export default function refreshToken(state = initialState, action) {
  switch (action.type) {
    case CHANGE_REFRESH_TOKEN_INFO:
      return action.refreshToken;

    default:
      return state;
  }
}
