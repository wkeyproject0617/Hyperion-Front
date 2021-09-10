// action 타입
const CHANGE_WEEK = 'mode/CHANGE_WEEK';

export const changeWeek = (num) => ({ type: CHANGE_WEEK, weekNum: num });

const initialState = 0;

export default function week(state = initialState, action) {
  switch (action.type) {
    case CHANGE_WEEK:
      return action.weekNum;

    default:
      return state;
  }
}
