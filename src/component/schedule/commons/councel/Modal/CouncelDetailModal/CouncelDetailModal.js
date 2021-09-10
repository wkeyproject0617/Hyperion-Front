import axios from 'axios';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeConfirmModalInfo } from '../../../../../../redux/modules/schedule/confirmModalInfo';
import './CouncelDetailModal.css';
import Api from '../../../../../../api/dataControllerApi';
import duplicateData from '../../../../../../commons/test/teacherManage/makeUpLesson/duplicate';
import noDuplicateData from '../../../../../../commons/test/teacherManage/makeUpLesson/noDuplicate';
import { changeEditModalInfo } from '../../../../../../redux/modules/schedule/mul/editModalInfo';
import makeUpLessonShowData from '../../../../../../commons/test/teacherManage/attendance/makeUpLessonShow';
import { changeCouncelDetailModalInfo } from '../../../../../../redux/modules/councel/councelDetailModalInfo';
import consultContentData from '../../../../../../commons/test/teacherManage/councel/consultContent';

function CouncelDetailModal({ title, onCancel }) {
  const dispatch = useDispatch();
  const onChangeCouncelDetailModalInfo = (councelDetailModalInfo) =>
    dispatch(changeCouncelDetailModalInfo(councelDetailModalInfo));
  const councelDetailModalInfo = useSelector((state) => state.councelDetailModalInfo);
  const onChangeConfirmModalInfo = (confirmModalInfo) => dispatch(changeConfirmModalInfo(confirmModalInfo));
  const [inputInfo, setInputInfo] = useState({
    studentName: null,
    subjectName: null,
    content: null,
  });
  const token = useSelector((state) => state.token);
  const header = useMemo(() => {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, [token]);
  const handleComplete = async (e) => {
    const res = await Api.postData(
      '/adminApi/signUp/student/consult/consultedButton',
      { consult_id: councelDetailModalInfo.data.id },
      header,
    );
    console.log(res);
    if (res.data.description === '등록성공') {
      onChangeCouncelDetailModalInfo({ show: false, data: null });
      onChangeConfirmModalInfo({ show: true, data: { title: '상담 완료', content: '상담이 완료되었습니다.' } });
    } else {
      //handling error
    }
  };

  const getInfo = useCallback(async () => {
    let url;
    console.log(councelDetailModalInfo.data.id);
    if (councelDetailModalInfo.data.consulted) {
      url = `/adminApi/signUp/student/consult/consulted/show?consulted_id=${councelDetailModalInfo.data.id}`;
    } else {
      url = `/adminApi/signUp/student/consult/consultingList/show?consult_id=${councelDetailModalInfo.data.id}`;
    }
    const res = await Api.getData(url, header);
    console.log(res);
    if (res.data.description === '조회성공') {
      setInputInfo({
        studentName: res.data.data.student_name,
        subjectName:
          res.data.data.subject_category + '/' + res.data.data.subject_title + '/' + res.data.data.subject_level,
        content: res.data.data.consult_content,
      });
    } else {
      // handling error
    }
  }, []);

  useEffect(() => {
    getInfo();
  }, [getInfo]);
  console.log(inputInfo);
  return (
    <div className="ScheduleCourse">
      <div className="ScheduleCourse__ContentWrap">
        <div className="ScheduleCourse__TopBottomStyle"></div>
        <div className="ScheduleCourse__Header">{title}</div>
        <div className="ScheduleCourse__Content">
          <div className="ScheduleCourse__StudentInputWrap">
            <div className="ScheduleCourse__InputLabel">학생명</div>
            <input className="ScheduleCourse__Input" value={inputInfo.studentName} />
          </div>
          <div className="ScheduleCourse__SubjectInputWrap">
            <div className="ScheduleCourse__InputLabel">과목 리스트</div>
            <input className="ScheduleCourse__Input" value={inputInfo.subjectName} />
          </div>
          <div className="ScheduleCourse__SubjectInputWrap">
            <div className="ScheduleCourse__InputLabel">상담 내용</div>
            <div className="ScheduleCourse__Input ScheduleCourse__Input__Content">{inputInfo.content}</div>
          </div>
        </div>
        <div className="ScheduleCourse__Foot">
          <button
            className="ScheduleCourse__Delete"
            onClick={onCancel}
            style={
              councelDetailModalInfo.data.consulted ? { backgroundColor: '#1b3965', borderColor: '#102340' } : null
            }
          >
            확인
          </button>
          {!councelDetailModalInfo.data.consulted && (
            <button className="ScheduleCourse__Register" onClick={handleComplete}>
              상담 완료
            </button>
          )}
        </div>
        <div className="ScheduleCourse__TopBottomStyle"></div>
      </div>
    </div>
  );
}

export default CouncelDetailModal;
