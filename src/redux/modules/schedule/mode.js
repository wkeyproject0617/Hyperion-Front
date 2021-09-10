// action 타입
const CHANGE_MODE = 'mode/CHANGE_MODE';

export const changeMode = (mode) => ({ type: CHANGE_MODE, mode });

const initialState = 'TEACHER';

export default function mode(state = initialState, action) {
  switch (action.type) {
    case CHANGE_MODE:
      return action.mode;
    default:
      return state;
  }
}
