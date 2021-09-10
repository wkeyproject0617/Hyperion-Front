import ConfirmModal from '../../../../common/confirmModal';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { changeAttdRecModalInfo } from '../../../../../redux/modules/attdRecModalInfo';

const AttdRec = () => {
  const attdRecModalInfo = useSelector((state) => state.attdRecModalInfo);
  const dispatch = useDispatch();
  const onChangeAttdRecModalInfo = (attdRecModalInfo) => dispatch(changeAttdRecModalInfo(attdRecModalInfo));
  const handleConfirmModal = (attdModalInfo) => {
    if (attdRecModalInfo.mode === 'REC_START') {
      onChangeAttdRecModalInfo({
        show: false,
        mode: '',
        startDate: '',
        endDate: '',
        content: '',
      });
    } else if (attdModalInfo.mode === 'REC_END') {
      onChangeAttdRecModalInfo({
        show: true,
        mode: 'REC_START',
        startDate: '',
        endDate: '',
        content: [attdModalInfo.startDate, ' 기록 시작', <br></br>, attdModalInfo.endDate, ' 기록 종료'],
        // `'${attdModalInfo.startDate}' 기록 시작\n '${attdModalInfo.endDate}' 기록 종료`,
      });
    }
  };
  return (
    <>
      {attdRecModalInfo.show && (
        <ConfirmModal
          title="출석 기록"
          content={attdRecModalInfo.content}
          callback={() => handleConfirmModal(attdRecModalInfo)}
        />
      )}
    </>
  );
};

export default AttdRec;
