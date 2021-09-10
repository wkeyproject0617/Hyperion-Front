// 예시 { id: 5, name: "전애지", funct: "ATTENDANCE" }
const CHANGE_EDIT_MODAL_INFO = 'editModalInfo/CHANGE_EDIT_MODAL_INFO';

export const changeEditModalInfo = (editModalInfo) => ({
  type: CHANGE_EDIT_MODAL_INFO,
  editModalInfo,
});

const initialState = {
  show: false,
  data: null,
};

export default function editModalInfo(state = initialState, action) {
  switch (action.type) {
    case CHANGE_EDIT_MODAL_INFO:
      return action.editModalInfo;

    default:
      return state;
  }
}
