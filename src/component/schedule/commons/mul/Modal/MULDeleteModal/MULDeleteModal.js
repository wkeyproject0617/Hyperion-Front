import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Api from '../../../../../../api/dataControllerApi';
import { changeConfirmModalInfo } from '../../../../../../redux/modules/schedule/confirmModalInfo';
import { changeDeleteModalInfo } from '../../../../../../redux/modules/schedule/mul/deleteModalInfo';
import './MULDeleteModal.css';

function MULDeleteModal({ title, content, onCancel }) {
  const deleteModalInfo = useSelector((state) => state.deleteModalInfo);
  const dispatch = useDispatch();
  const onChangeConfirmModalInfo = (confirmModalInfo) => dispatch(changeConfirmModalInfo(confirmModalInfo));
  const onChangeDeleteModalInfo = (deleteModalInfo) => dispatch(changeDeleteModalInfo(deleteModalInfo));
  const token = useSelector((state) => state.token);
  const header = useMemo(() => {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, [token]);
  const handleDelete = async () => {
    console.log(deleteModalInfo.data.id);
    const res = await Api.deleteData(`/adminApi/signUp/student/makeUpLesson/delete/${deleteModalInfo.data.id}`, header);
    console.log(res);
    onChangeDeleteModalInfo({ show: false, data: null });

    if (res.data.description === '조회성공') {
      onChangeConfirmModalInfo({ show: true, data: { title: '삭제 완료', content: '삭제되었습니다.' } });
    } else {
      // handling error
    }
  };

  return (
    <div className="ConfirmModal">
      <div className="ConfirmModal__ContentsWrap">
        <div className="ConfirmModal__TopBottomStyle"></div>
        <div className="ConfirmModal__TitleWrap">
          <span className="ConfirmModal__Text">{title}</span>
        </div>
        <div className="ConfirmModal__Contents">
          <div className="ConfirmModal__TextWrap">
            <span className="ConfirmModal__Text">{content}</span>
          </div>
        </div>
        <div className="ConfirmModal__ControlButtonWrap">
          <button className="ConfirmModal__ButtonCancel" onClick={onCancel}>
            취소
          </button>
          <button className="ConfirmModal__ButtonDelete" onClick={handleDelete}>
            삭제
          </button>
        </div>
        <div className="ConfirmModal__TopBottomStyle"></div>
      </div>
    </div>
  );
}

export default MULDeleteModal;
