// action 타입
const CHANGE_COUNCEL_LIST = 'makeUpLessonList/CHANGE_COUNCEL_LIST';

export const changeCouncelList = (councelList) => ({ type: CHANGE_COUNCEL_LIST, councelList });

const initialState = [];

export default function councelList(state = initialState, action) {
  switch (action.type) {
    case CHANGE_COUNCEL_LIST:
      return action.councelList;

    default:
      return state;
  }
}
