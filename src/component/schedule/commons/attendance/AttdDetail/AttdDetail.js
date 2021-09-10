import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeAttdDetailModalInfo } from '../../../../../redux/modules/attdDetailModalInfo';
import NormalConfirmModal from '../../../../common/ConfirmModal/NormalModal/NormalConfirmModal';

const AttdDetail = () => {
   const attdDetailModalInfo = useSelector((state) => state.attdDetailModalInfo);
   const dispatch = useDispatch();
   const onChangeAttdDetailModalInfo = (attdDetailModalInfo) =>
     dispatch(changeAttdDetailModalInfo(attdDetailModalInfo));

  return (
    <>
      {attdDetailModalInfo.show && (
        <NormalConfirmModal
          title="상세 정보"
          data={attdDetailModalInfo.data}
          onClose={() =>
            onChangeAttdDetailModalInfo({
              show: false,
              data: null,
            })
          }
        />
      )}
    </>
  );
};

export default AttdDetail;
