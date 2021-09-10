import './NavMakeUpLessonFunctions.css';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeContentModalInfo } from '../../../../../redux/modules/schedule/mul/contentModalInfo';
import { changeAddModalInfo } from '../../../../../redux/modules/schedule/mul/addModalInfo';
import { changeEditModalInfo } from '../../../../../redux/modules/schedule/mul/editModalInfo';
import { changeConfirmModalInfo } from '../../../../../redux/modules/schedule/confirmModalInfo';
import { changeDeleteModalInfo } from '../../../../../redux/modules/schedule/mul/deleteModalInfo';

// 클릭된 수업의 기능을 지정
export default function NavMakeUpLessonFunctions({ data }) {
  const dispatch = useDispatch();
  const onChangeMulContentModalInfo = (contentModalInfo) => dispatch(changeContentModalInfo(contentModalInfo));
  const onChangeAddModalInfo = (addModalInfo) => dispatch(changeAddModalInfo(addModalInfo));
  const onChangeEditModalInfo = (editModalInfo) => dispatch(changeEditModalInfo(editModalInfo));
  const onChangeDeleteModalInfo = (deleteModalInfo) => dispatch(changeDeleteModalInfo(deleteModalInfo));
  console.log(data);
  return (
    <div className="Schedule__MakeUpLesson__NavMakeUpLessonFunctionWrap">
      {data.schedule ? (
        <>
          <button
            className="Schedule__MakeUpLesson__Button"
            value="SEE_CONTENT"
            onClick={() => onChangeMulContentModalInfo({ show: true, data: { id: data.consultId } })}
          >
            보강 상담 보기
          </button>
          <button
            className="Schedule__MakeUpLesson__Button"
            value="EDIT_SCHEDULE"
            onClick={() =>
              onChangeEditModalInfo({ show: true, data: { lessonId: data.lessonId, consultId: data.consultId } })
            }
          >
            보강 일정 수정
          </button>
          <button
            className="Schedule__MakeUpLesson__Button"
            value="DELETE_SCHEDULE"
            onClick={() => onChangeDeleteModalInfo({ show: true, data: { id: data.lessonId } })}
          >
            보강 일정 삭제
          </button>
        </>
      ) : (
        <>
          <button
            className="Schedule__MakeUpLesson__Button"
            value="SEE_CONTENT"
            onClick={() => onChangeMulContentModalInfo({ show: true, data: { id: data.consultId } })}
          >
            보강 상담 보기
          </button>
          <button
            className="Schedule__MakeUpLesson__Button"
            value="ADD_SCHEDULE"
            onClick={() =>
              onChangeAddModalInfo({
                show: true,
                data: { consultId: data.consultId, subjectName: data.subjectName, lectureId: data.lectureId },
              })
            }
          >
            보강 일정 추가
          </button>
        </>
      )}
    </div>
  );
}
