// 예시 { id: 5, name: "전애지", funct: "ATTENDANCE" }
const CHANGE_CLICKED_TEACHER_INFO = 'clickedTeacherInfo/CHANGE_CLICKED_TEACHER_INFO';

export const changeClickedTeacherInfo = (clickedTeacherInfo) => ({ type: CHANGE_CLICKED_TEACHER_INFO, clickedTeacherInfo });

const initialState = null;

export default function clickedTeacherInfo(state = initialState, action) {
  switch (action.type) {
    case CHANGE_CLICKED_TEACHER_INFO:
      return action.clickedTeacherInfo;

    default:
      return state;
  }
}
