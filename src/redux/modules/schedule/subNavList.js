// 일정관리에서 scheduleSubNav(두 번째 레이아웃) 리스트에 보여줄 정보

const CHANGE_SUB_NAV_LIST_INFO = 'subNavList/CHANGE_SUB_NAV_LIST_INFO';

export const changeSubNavList = (subNavList) => ({ type: CHANGE_SUB_NAV_LIST_INFO, subNavList });

const initialState = [];

export default function subNavList(state = initialState, action) {
  switch (action.type) {
    case CHANGE_SUB_NAV_LIST_INFO:
      return action.subNavList;

    default:
      return state;
  }
}
