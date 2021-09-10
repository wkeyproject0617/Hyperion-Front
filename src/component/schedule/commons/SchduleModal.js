import { useDispatch, useSelector } from 'react-redux';
import { changeConfirmModalInfo } from '../../../redux/modules/schedule/confirmModalInfo';
import ConfirmModal from '../../common/Modal/NormalModal/confirmModal';
import CouncelModal from './councel/Modal/CouncelModal';
import FilteringModal from './FilteringModal/FilteringModal';
import MULModal from './mul/Modal/MULModal';

// 일정 관리에서 사용하는 모달
const ScheduleModal = () => {
  const filterModalInfo = useSelector((state) => state.filterModalInfo);
  const confirmModalInfo = useSelector((state) => state.confirmModalInfo);
  const dispatch = useDispatch();
  const onChangeConfirmModalInfo = (confirmModalInfo) => dispatch(changeConfirmModalInfo(confirmModalInfo));
  return (
    <>
      {filterModalInfo.show && <FilteringModal title="과목 및 날짜 검색" />}
      <MULModal />
      <CouncelModal />
      {confirmModalInfo.show && (
        <ConfirmModal
          title={confirmModalInfo.data.title}
          content={confirmModalInfo.data.content}
          callback={() => onChangeConfirmModalInfo({ show: false, data: null })}
        />
      )}
    </>
  );
};

export default ScheduleModal;
