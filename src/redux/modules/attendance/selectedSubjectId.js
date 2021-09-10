// 예시 { id: 5, name: "전애지", funct: "ATTENDANCE" }
const CHANGE_SELECTED_SUBJECT_ID = 'selectedSubjectId/CHANGE_SELECTED_SUBJECT_ID';

export const changeselectedSubjectId = (selectedSubjectId) => ({
  type: CHANGE_SELECTED_SUBJECT_ID,
  selectedSubjectId,
});

const initialState = null;

export default function selectedSubjectId(state = initialState, action) {
  switch (action.type) {
    case CHANGE_SELECTED_SUBJECT_ID:
      return action.selectedSubjectId;

    default:
      return state;
  }
}
