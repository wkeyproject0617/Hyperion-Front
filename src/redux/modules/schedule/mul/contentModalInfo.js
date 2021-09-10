// 예시 { id: 5, name: "전애지", funct: "ATTENDANCE" }
const CHANGE_CONTENT_MODAL_INFO = 'contentModalInfo/CHANGE_CONTENT_MODAL_INFO';

export const changeContentModalInfo = (contentModalInfo) => ({
  type: CHANGE_CONTENT_MODAL_INFO,
  contentModalInfo,
});

const initialState = {
  show: false,
  data: null,
};

export default function contentModalInfo(state = initialState, action) {
  switch (action.type) {
    case CHANGE_CONTENT_MODAL_INFO:
      return action.contentModalInfo;

    default:
      return state;
  }
}
