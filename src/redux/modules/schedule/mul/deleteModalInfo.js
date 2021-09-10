// 예시 { id: 5, name: "전애지", funct: "ATTENDANCE" }
const CHANGE_DELETE_MODAL_INFO = 'deleteModalInfo/CHANGE_DELETE_MODAL_INFO';

export const changeDeleteModalInfo = (deleteModalInfo) => ({
  type: CHANGE_DELETE_MODAL_INFO,
  deleteModalInfo,
});

const initialState = {
  show: false,
  data: null,
};

export default function deleteModalInfo(state = initialState, action) {
  switch (action.type) {
    case CHANGE_DELETE_MODAL_INFO:
      return action.deleteModalInfo;

    default:
      return state;
  }
}
