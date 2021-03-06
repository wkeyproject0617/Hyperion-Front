import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeConfirmModalInfo } from '../../../../../../redux/modules/schedule/confirmModalInfo';
import './MULAddModal.css';
import Api from '../../../../../../api/dataControllerApi';
import duplicateData from '../../../../../../commons/test/teacherManage/makeUpLesson/duplicate';
import noDuplicateData from '../../../../../../commons/test/teacherManage/makeUpLesson/noDuplicate';
import { changeAddModalInfo } from '../../../../../../redux/modules/schedule/mul/addModalInfo';

function MULAddModal({ title, onCancel }) {
  const [token, setToken] = useState(window.localStorage.getItem('accessToken'));
  const refreshToken = window.localStorage.getItem('refreshToken');

  const addModalInfo = useSelector((state) => state.addModalInfo);
  const dispatch = useDispatch();
  const onChangeConfirmModalInfo = (confirmModalInfo) => dispatch(changeConfirmModalInfo(confirmModalInfo));
  const onChangeAddModalInfo = (addModalInfo) => dispatch(changeAddModalInfo(addModalInfo));
  const hours = [...Array(15).keys()].map((key) => key + 9);
  const minutes = [...Array(6).keys()].map((key) => key * 10);
  const [inputInfo, setInputInfo] = useState({
    date: '2021-05-10',
    startHour: null,
    startMinute: null,
    endHour: null,
    endMinute: null,
  });

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
    const header = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const startTime = inputInfo.startHour + ':' + inputInfo.startMinute + ':00';
    const endTime = inputInfo.endHour + ':' + inputInfo.endMinute + ':00';
    console.log({
      end_time: endTime,
      lecture_id: addModalInfo.lectureId,
      start_class_time: inputInfo.date,
      start_time: startTime,
    });
    const res = await Api.postData(
      '/adminApi/makeUpLessonCheck',
      {
        end_time: endTime,
        lecture_id: addModalInfo.data.lectureId,
        start_class_time: inputInfo.date,
        start_time: startTime,
      },
      header,
    );
    console.log(res);
    if (res.data.description === '????????????') {
      const res2 = await Api.postData(
        '/adminApi/signUp/student/makeUpLesson',
        {
          consult_id: addModalInfo.data.consultId,
          end_time: endTime,
          start_class_time: inputInfo.date,
          start_time: startTime,
        },
        header,
      );
      console.log(res2);
      if (res2.data.description === '????????????') {
        onChangeAddModalInfo({ show: false, data: null });
        onChangeConfirmModalInfo({ show: true, data: { title: '??????', content: '????????? ?????????????????????.' } });
      } else {
        onChangeConfirmModalInfo({ show: true, data: { title: '??????', content: '?????? ??????????????????.' } });
      }
    } else if (res.data.consultIddescription === '??????') {
      const content = res.data.data.map((data) => [`${data.day} ${data.start_time} ~ ${data.end_time}`, <br></br>]);
      content.push(['?????? ????????? ????????????.', <br></br>, '?????? ??????????????????.']);
      onChangeConfirmModalInfo({
        show: true,
        data: {
          title: '??????',
          content,
        },
      });
    } else {
      //error handling
    }
  };

  const handleAdd = () => {
    // ?????? ?????? ????????? ??????????????? ??????
    console.log(inputInfo);
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
          title: '??????',
          content: '???????????? ?????? ????????????.',
        },
      });
    } else if (
      parseInt(inputInfo.startHour) > parseInt(inputInfo.endHour) ||
      (parseInt(inputInfo.startHour) === parseInt(inputInfo.endHour) &&
        parseInt(inputInfo.startMinute) >= parseInt(inputInfo.endMinute))
    ) {
      // ?????? ?????? ?????????
      onChangeConfirmModalInfo({
        show: true,
        data: {
          title: '??????',
          content: '????????? ????????? ?????????????????????.',
        },
      });
    } else {
      // ?????? ?????? ??????
      checkDup();
    }
  };
  return (
    <div className="ScheduleCourse">
      <div className="ScheduleCourse__ContentWrap">
        <div className="ScheduleCourse__TopBottomStyle"></div>
        <div className="ScheduleCourse__Header">{title}</div>
        <div className="ScheduleCourse__Content">
          <div className="ScheduleCourse__StudentInputWrap">
            <div className="ScheduleCourse__InputLabel">?????????</div>
            <input className="ScheduleCourse__Input" value="?????????" />
          </div>
          <div className="ScheduleCourse__SubjectInputWrap">
            <div className="ScheduleCourse__InputLabel">?????? ?????????</div>
            <input className="ScheduleCourse__Input" value={addModalInfo.data.subjectName} />
          </div>

          <div className="ScheduleCourse__TeacherInputWrap">
            <div className="ScheduleCourse__InputLabel">?????? ??????</div>
            <input className="ScheduleCourse__Input" value="2021-05-10" />
          </div>

          <div className="ScheduleCourse__TimeInputWrap">
            <div className="ScheduleCourse__InputLabel">?????? ??????</div>
            <div className="ScheduleCourse__TimeInputContent">
              <select name="startHour" onChange={handleSelect}>
                <option selected disabled>
                  ???
                </option>
                {hours.map((hour) => (
                  <option value={('0' + hour).slice(-2)}>{('0' + hour).slice(-2)}</option>
                ))}
              </select>
              <span className="ScheduleCourse__TimeInputLabel">???</span>
              <select name="startMinute" onChange={handleSelect}>
                <option selected disabled>
                  ???
                </option>
                {minutes.map((minute) => (
                  <option value={('0' + minute).slice(-2)}>{('0' + minute).slice(-2)}</option>
                ))}
              </select>
              <span className="ScheduleCourse__TimeInputLabel">???</span>
              <span className="ScheduleCourse__TimeInputLabel">~</span>
              <select name="endHour" onChange={handleSelect}>
                <option selected disabled>
                  ???
                </option>
                {hours.map((hour) => (
                  <option value={('0' + hour).slice(-2)}>{('0' + hour).slice(-2)}</option>
                ))}
              </select>
              <span className="ScheduleCourse__TimeInputLabel">???</span>

              <select name="endMinute" onChange={handleSelect}>
                <option selected disabled>
                  ???
                </option>
                {minutes.map((minute) => (
                  <option value={('0' + minute).slice(-2)}>{('0' + minute).slice(-2)}</option>
                ))}
              </select>
              <span className="ScheduleCourse__TimeInputLabel">???</span>
            </div>
          </div>
        </div>
        <div className="ScheduleCourse__Foot">
          <button className="ScheduleCourse__Delete" onClick={onCancel}>
            ??????
          </button>
          <button className="ScheduleCourse__Register" onClick={handleAdd}>
            ??????
          </button>
        </div>
        <div className="ScheduleCourse__TopBottomStyle"></div>
      </div>
    </div>
  );
}

export default MULAddModal;
