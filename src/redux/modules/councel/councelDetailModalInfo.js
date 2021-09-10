// 예시 { id: 5, name: "전애지", funct: "ATTENDANCE" }
const CHANGE_COUNCEL_DETAIL_MODAL_INFO = 'councelDetailModalInfo/CHANGE_COUNCEL_DETAIL_MODAL_INFO';

export const changeCouncelDetailModalInfo = (councelDetailModalInfo) => ({
  type: CHANGE_COUNCEL_DETAIL_MODAL_INFO,
  councelDetailModalInfo,
});

const initialState = {
  show: false,
  data: null,
};

export default function councelDetailModalInfo(state = initialState, action) {
  switch (action.type) {
    case CHANGE_COUNCEL_DETAIL_MODAL_INFO:
      return action.councelDetailModalInfo;

    default:
      return state;
  }
}
