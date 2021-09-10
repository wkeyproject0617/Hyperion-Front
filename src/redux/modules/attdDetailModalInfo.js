// 예시 { id: 5, name: "전애지", funct: "ATTENDANCE" }
const CHANGE_ATTD_DETAIL_MODAL_INFO = 'attdDetailModalInfo/CHANGE_ATTD_DETAIL_MODAL_INFO';

export const changeAttdDetailModalInfo = (attdDetailModalInfo) => ({
  type: CHANGE_ATTD_DETAIL_MODAL_INFO,
  attdDetailModalInfo,
});

const initialState = {
  show: false,
  data: null,
};

export default function attdDetailModalInfo(state = initialState, action) {
  switch (action.type) {
    case CHANGE_ATTD_DETAIL_MODAL_INFO:
      return action.attdDetailModalInfo;

    default:
      return state;
  }
}
