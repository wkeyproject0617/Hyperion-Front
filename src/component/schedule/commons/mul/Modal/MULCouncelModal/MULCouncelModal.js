import axios from 'axios';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './MULCouncelModal.css';
import councelContentData from '../../../../../../commons/test/teacherManage/makeUpLesson/councelContent';
import Api from 'api/dataControllerApi';
import { useSelector } from 'react-redux';

function MULCouncelModal({ title, onCancel }) {
  const [consultInfo, setConsultInfo] = useState(null);
  const contentModalInfo = useSelector((state) => state.contentModalInfo);
  const token = useSelector((state) => state.token);
  const header = useMemo(() => {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, [token]);
  const getConsultInfo = useCallback(async () => {
    const res = await Api.getData(
      `/adminApi/signUp/student/consultShow?consult_id=${contentModalInfo.data.id}`,
      header,
    );
    if (res.data.description === '조회성공') {
      setConsultInfo({
        name: res.data.data['student_name'],
        date: res.data.data['consult_day'],
        account: res.data.data['student_account'],
        content: res.data.data['consult_contents'],
      });
    } else {
      // handling error
    }
  }, []);
  useEffect(() => {
    getConsultInfo();
  }, [getConsultInfo]);
  return (
    <div className="ScheduleCourse">
      <div className="ScheduleCourse__ContentWrap">
        <div className="ScheduleCourse__TopBottomStyle"></div>
        <div className="ScheduleCourse__Header">{title}</div>
        <div className="ScheduleCourse__Content">
          <div className="ScheduleCourse__TeacherInputWrap">
            <div className="ScheduleCourse__InputLabel">학생명</div>
            <div className="ScheduleCourse__Input">
              {consultInfo && consultInfo.name + ' (' + consultInfo.account + ')'}
            </div>
          </div>
          <div className="ScheduleCourse__StudentInputWrap">
            <div className="ScheduleCourse__InputLabel">등록일</div>
            <div className="ScheduleCourse__Input MULCouncelModal_RegisterDay_Content">
              {consultInfo && consultInfo.date.replaceAll('-', '.').slice(2) + '.'}
            </div>
          </div>
          <div className="ScheduleCourse__SubjectInputWrap">
            <div className="ScheduleCourse__InputLabel">상담 내용</div>
            <div className="ScheduleCourse__Input MULCouncelModal__CouncelContent">
              {consultInfo && consultInfo.content}
            </div>
          </div>
        </div>
        <div className="ScheduleCourse__Foot">
          <button className="ScheduleCourse__Register" onClick={onCancel}>
            확인
          </button>
        </div>
        <div className="ScheduleCourse__TopBottomStyle"></div>
      </div>
    </div>
  );
}

export default MULCouncelModal;
