import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeContentModalInfo } from '../../../../../redux/modules/schedule/mul/contentModalInfo';
import MULCouncelModal from './MULCouncelModal/MULCouncelModal';
import MULAddModal from './MULAddModal/MULAddModal';
import { changeAddModalInfo } from '../../../../../redux/modules/schedule/mul/addModalInfo';
import MULEditModal from './MULEditModal/MULEditModal';
import MULDeleteModal from './MULDeleteModal/MULDeleteModal';
import { changeConfirmModalInfo } from '../../../../../redux/modules/schedule/confirmModalInfo';
import { changeEditModalInfo } from '../../../../../redux/modules/schedule/mul/editModalInfo';
import { changeDeleteModalInfo } from '../../../../../redux/modules/schedule/mul/deleteModalInfo';
import { changeCouncelDetailModalInfo } from '../../../../../redux/modules/councel/councelDetailModalInfo';
import ConfirmModal from '../../../../common/Modal/NormalModal/confirmModal';

const MULModal = () => {
  const contentModalInfo = useSelector((state) => state.contentModalInfo);
  const dispatch = useDispatch();
  const onChangeMulContentModalInfo = (contentModalInfo) => dispatch(changeContentModalInfo(contentModalInfo));
  const addModalInfo = useSelector((state) => state.addModalInfo);
  const onChangeAddModalInfo = (addModalInfo) => dispatch(changeAddModalInfo(addModalInfo));
  const confirmModalInfo = useSelector((state) => state.confirmModalInfo);
  const onChangeConfirmModalInfo = (confirmModalInfo) => dispatch(changeConfirmModalInfo(confirmModalInfo));
  const editModalInfo = useSelector((state) => state.editModalInfo);
  const onChangeEditModalInfo = (editModalInfo) => dispatch(changeEditModalInfo(editModalInfo));
  const deleteModalInfo = useSelector((state) => state.deleteModalInfo);
  const onChangeDeleteModalInfo = (deleteModalInfo) => dispatch(changeDeleteModalInfo(deleteModalInfo));
  return (
    <>
      {contentModalInfo.show && (
        <MULCouncelModal
          title="보강 상담 보기"
          onCancel={() => onChangeMulContentModalInfo({ show: false, data: null })}
        />
      )}
      {addModalInfo.show && (
        <MULAddModal title="보강 일정 추가" onCancel={() => onChangeAddModalInfo({ show: false, data: null })} />
      )}
      {editModalInfo.show && (
        <MULEditModal title="보강 일정 수정" onCancel={() => onChangeEditModalInfo({ show: false, data: null })} />
      )}
      {deleteModalInfo.show && (
        <MULDeleteModal
          title="보강 일정 삭제"
          content="보강 일정을 삭제하시겠습니까?"
          onCancel={() => onChangeDeleteModalInfo({ show: false, data: null })}
        />
      )}
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

export default MULModal;
