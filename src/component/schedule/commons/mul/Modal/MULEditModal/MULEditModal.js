import axios from 'axios';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeConfirmModalInfo } from '../../../../../../redux/modules/schedule/confirmModalInfo';
import './MULEditModal.css';
import Api from '../../../../../../api/dataControllerApi';
import duplicateData from '../../../../../../commons/test/teacherManage/makeUpLesson/duplicate';
import noDuplicateData from '../../../../../../commons/test/teacherManage/makeUpLesson/noDuplicate';
import { changeEditModalInfo } from '../../../../../../redux/modules/schedule/mul/editModalInfo';
import makeUpLessonShowData from '../../../../../../commons/test/teacherManage/attendance/makeUpLessonShow';

function MULEditModal({ title, onCancel }) {
  const editModalInfo = useSelector((state) => state.editModalInfo);
  const dispatch = useDispatch();
  const onChangeConfirmModalInfo = (confirmModalInfo) => dispatch(changeConfirmModalInfo(confirmModalInfo));
  const onChangeEditModalInfo = (editModalInfo) => dispatch(changeEditModalInfo(editModalInfo));
  const token = useSelector((state) => state.token);
  const header = useMemo(() => {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, [token]);
  const hours = [...Array(15).keys()].map((key) => key + 9);
  const minutes = [...Array(6).keys()].map((key) => key * 10);
  const [inputInfo, setInputInfo] = useState({
    name: null,
    subjectName: null,
    date: null,
    startHour: null,
    startMinute: null,
    endHour: null,
    endMinute: null,
  });
  console.log(inputInfo);
  const handleSelect = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const _inputInfo = {
      ...inputInfo,
    };
    _inputInfo[name] = value;
    setInputInfo(_inputInfo);
  };
  const checkDup = async () => {
    const startTime = inputInfo.startHour + ':' + inputInfo.startMinute + ':00';
    const endTime = inputInfo.endHour + ':' + inputInfo.endMinute + ':00';
    // 보강 일정과 겹치는지 체크
    const res1 = await Api.postData(
      '/adminApi/makeUpLessonCheck',
      {
        end_time: endTime,
        lecture_id: editModalInfo.data.lessonId,
        start_class_time: inputInfo.date,
        start_time: startTime,
      },
      header,
    );
    console.log(res1);
    if (res1.data.description === '중복없음') {
      console.log({
        make_up_lesson_id: editModalInfo.data.lessonId,
        consult_id: editModalInfo.data.consultId,
        end_time: endTime,
        start_class_time: inputInfo.date,
        start_time: startTime,
      });
      const res2 = await Api.patchData(
        '/adminApi/signUp/student/makeUpLesson/update',
        {
          make_up_lesson_id: editModalInfo.data.lessonId,
          consult_id: editModalInfo.data.consultId,
          end_time: endTime,
          start_class_time: inputInfo.date,
          start_time: startTime,
        },
        header,
      );
      console.log(res2);
      if (res2.data.description === '수정성공') {
        onChangeEditModalInfo({ show: false, data: null });
        onChangeConfirmModalInfo({ show: true, data: { title: '완료', content: '일정이 수정되었습니다.' } });
      } else {
        onChangeConfirmModalInfo({ show: true, data: { title: '실패', content: '다시 시도해주세요.' } });
      }
    } else if (res1.data.description === '중복') {
      const content = res1.data.data.map((data) => [`${data.day} ${data.start_time} ~ ${data.end_time}`, <br></br>]);
      console.log(content);
      content.push(['위의 일정과 겹칩니다.', <br></br>, '다시 시도해주세요.']);
      onChangeConfirmModalInfo({
        show: true,
        data: {
          title: '경고',
          content,
        },
      });
    } else {
      //error handling
    }
  };

  const handleAdd = () => {
    // 수업 시간 제대로 입력됐는지 체크
    if (
      !inputInfo.date ||
      !inputInfo.startHour ||
      !inputInfo.startMinute ||
      !inputInfo.endHour ||
      !inputInfo.endMinute
    ) {
      onChangeConfirmModalInfo({
        show: true,
        data: {
          title: '경고',
          content: '비어있는 칸이 있습니다.',
        },
      });
    } else if (
      parseInt(inputInfo.startHour) > parseInt(inputInfo.endHour) ||
      (parseInt(inputInfo.startHour) === parseInt(inputInfo.endHour) &&
        parseInt(inputInfo.startMinute) >= parseInt(inputInfo.endMinute))
    ) {
      // 시간 잘못 입력함
      onChangeConfirmModalInfo({
        show: true,
        data: {
          title: '경고',
          content: '잘못된 시간을 입력하였습니다.',
        },
      });
    } else {
      // 수업 중복 체크
      checkDup();
    }
  };
  const getInfo = useCallback(async () => {
    console.log(editModalInfo);
    const res = await Api.getData(
      `/adminApi/signUp/student/makeUpLesson/show?make_up_lesson_id=${editModalInfo.data.lessonId}`,
      header,
    );
    console.log(res);
    if (res.data.description === '조회성공') {
      setInputInfo({
        name: res.data.data.student_name,
        subjectName:
          res.data.data.subject_category + '/' + res.data.data.subject_title + '/' + res.data.data.subject_level,
        date: res.data.data.start_class_time,
        startHour: res.data.data.start_time.split(':')[0],
        startMinute: res.data.data.start_time.split(':')[1],
        endHour: res.data.data.end_time.split(':')[0],
        endMinute: res.data.data.end_time.split(':')[1],
      });
    } else {
      // handling error
    }
  }, []);

  useEffect(() => {
    getInfo();
  }, [getInfo]);
  return (
    <div className="ScheduleCourse">
      <div className="ScheduleCourse__ContentWrap">
        <div className="ScheduleCourse__TopBottomStyle"></div>
        <div className="ScheduleCourse__Header">{title}</div>
        <div className="ScheduleCourse__Content">
          <div className="ScheduleCourse__StudentInputWrap">
            <div className="ScheduleCourse__InputLabel">학생명</div>
            <input className="ScheduleCourse__Input" value={inputInfo.name} />
          </div>
          <div className="ScheduleCourse__SubjectInputWrap">
            <div className="ScheduleCourse__InputLabel">과목 리스트</div>
            <input className="ScheduleCourse__Input" value={inputInfo.subjectName} />
          </div>

          <div className="ScheduleCourse__TeacherInputWrap">
            <div className="ScheduleCourse__InputLabel">수업 일자</div>
            <input className="ScheduleCourse__Input" value={inputInfo.date} />
          </div>

          <div className="ScheduleCourse__TimeInputWrap">
            <div className="ScheduleCourse__InputLabel">수업 시간</div>
            <div className="ScheduleCourse__TimeInputContent">
              <select name="startHour" onChange={handleSelect}>
                {hours.map((hour) => (
                  <option
                    value={('0' + hour).slice(-2)}
                    selected={inputInfo.startHour && hour === parseInt(inputInfo.startHour)}
                  >
                    {('0' + hour).slice(-2)}
                  </option>
                ))}
              </select>
              <span className="ScheduleCourse__TimeInputLabel">시</span>
              <select name="startMinute" onChange={handleSelect}>
                {minutes.map((minute) => (
                  <option
                    value={('0' + minute).slice(-2)}
                    selected={inputInfo.startMinute && minute === parseInt(inputInfo.startMinute)}
                  >
                    {('0' + minute).slice(-2)}
                  </option>
                ))}
              </select>
              <span className="ScheduleCourse__TimeInputLabel">분</span>
              <span className="ScheduleCourse__TimeInputLabel">~</span>
              <select name="endHour" onChange={handleSelect}>
                {hours.map((hour) => (
                  <option
                    value={('0' + hour).slice(-2)}
                    selected={inputInfo.endHour && hour === parseInt(inputInfo.endHour)}
                  >
                    {('0' + hour).slice(-2)}
                  </option>
                ))}
              </select>
              <span className="ScheduleCourse__TimeInputLabel">시</span>

              <select name="endMinute" onChange={handleSelect}>
                {minutes.map((minute) => (
                  <option
                    value={('0' + minute).slice(-2)}
                    selected={inputInfo.endMinute && minute === parseInt(inputInfo.endMinute)}
                  >
                    {('0' + minute).slice(-2)}
                  </option>
                ))}
              </select>
              <span className="ScheduleCourse__TimeInputLabel">분</span>
            </div>
          </div>
        </div>
        <div className="ScheduleCourse__Foot">
          <button className="ScheduleCourse__Delete" onClick={onCancel}>
            취소
          </button>
          <button className="ScheduleCourse__Register" onClick={() => handleAdd()}>
            수정
          </button>
        </div>
        <div className="ScheduleCourse__TopBottomStyle"></div>
      </div>
    </div>
  );
}

export default MULEditModal;
