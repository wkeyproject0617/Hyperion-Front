// 예시 { id: 5, name: "전애지", funct: "ATTENDANCE" }
const CHANGE_CONFIRM_MODAL_INFO = 'confirmModalInfo/CHANGE_CONFIRM_MODAL_INFO';

export const changeConfirmModalInfo = (confirmModalInfo) => ({
  type: CHANGE_CONFIRM_MODAL_INFO,
  confirmModalInfo,
});

const initialState = {
  show: false,
  data: null,
};

export default function confirmModalInfo(state = initialState, action) {
  switch (action.type) {
    case CHANGE_CONFIRM_MODAL_INFO:
      return action.confirmModalInfo;

    default:
      return state;
  }
}
