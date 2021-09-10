import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeCouncelDetailModalInfo } from '../../../../../redux/modules/councel/councelDetailModalInfo';
import CouncelDetailModal from './CouncelDetailModal/CouncelDetailModal';

const CouncelModal = () => {
  const councelDetailModalInfo = useSelector((state) => state.councelDetailModalInfo);
  const dispatch = useDispatch();
  const onChangeCouncelDetailModalInfo = (councelDetailModalInfo) =>
    dispatch(changeCouncelDetailModalInfo(councelDetailModalInfo));
  return (
    <>
      {councelDetailModalInfo.show && (
        <CouncelDetailModal
          title="상담 보기"
          onCancel={() => onChangeCouncelDetailModalInfo({ show: false, data: null })}
        />
      )}
    </>
  );
};

export default CouncelModal;
