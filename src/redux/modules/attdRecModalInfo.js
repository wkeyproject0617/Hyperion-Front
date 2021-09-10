// 예시 { id: 5, name: "전애지", funct: "ATTENDANCE" }
const CHANGE_ATTD_REC_MODAL_INFO = 'attdRecModalInfo/CHANGE_ATTD_REC_MODAL_INFO';

export const changeAttdRecModalInfo = (attdRecModalInfo) => ({
  type: CHANGE_ATTD_REC_MODAL_INFO,
  attdRecModalInfo,
});

const initialState = {
  show: false,
  mode: '',
  startDate: '',
  endDate: '',
  content: '',
};

export default function attdRecModalInfo(state = initialState, action) {
  switch (action.type) {
    case CHANGE_ATTD_REC_MODAL_INFO:
      return action.attdRecModalInfo;

    default:
      return state;
  }
}
