// 일정관리에서 scheduleBody(세 번째 레이아웃) table에 보여줄 정보

const CHANGE_BODY_INFO = 'bodyList/CHANGE_BODY_INFO';

export const changeBodyList = (bodyList) => ({ type: CHANGE_BODY_INFO, bodyList });

const initialState = [];

export default function bodyList(state = initialState, action) {
  switch (action.type) {
    case CHANGE_BODY_INFO:
      return action.bodyList;

    default:
      return state;
  }
}
