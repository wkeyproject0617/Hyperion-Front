// 일정관리에서 scheduleBody(세 번째 레이아웃) table에 보여줄 정보

const CHANGE_NAVLIST_INFO = 'navList/CHANGE_NAVLIST_INFO';

export const changeNavList = (navList) => ({ type: CHANGE_NAVLIST_INFO, navList });

const initialState = [];

export default function navList(state = initialState, action) {
  switch (action.type) {
    case CHANGE_NAVLIST_INFO:
      return action.navList;

    default:
      return state;
  }
}
