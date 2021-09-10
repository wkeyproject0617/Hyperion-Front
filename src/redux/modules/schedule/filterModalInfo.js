// action 타입
const CHANGE_FILTER_MODAL_INFO = 'filterModalInfo/CHANGE_FILTER_MODAL_INFO';

export const changefilterModalInfo = (filterModalInfo) => ({ type: CHANGE_FILTER_MODAL_INFO, filterModalInfo });

const initialState = { show: false, data: null };

export default function filterModalInfo(state = initialState, action) {
  switch (action.type) {
    case CHANGE_FILTER_MODAL_INFO:
      return action.filterModalInfo;
    default:
      return state;
  }
}
