// 예시 { id: 5, name: "전애지", funct: "ATTENDANCE" }
const CHANGE_ADD_MODAL_INFO = 'addModalInfo/CHANGE_ADD_MODAL_INFO';

export const changeAddModalInfo = (addModalInfo) => ({
  type: CHANGE_ADD_MODAL_INFO,
  addModalInfo,
});

const initialState = {
  show: false,
  data: null,
};

export default function addModalInfo(state = initialState, action) {
  switch (action.type) {
    case CHANGE_ADD_MODAL_INFO:
      return action.addModalInfo;

    default:
      return state;
  }
}
