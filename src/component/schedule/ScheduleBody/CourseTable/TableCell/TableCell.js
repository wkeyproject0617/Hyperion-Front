import React, { useMemo } from 'react';
// import '../CourseTable.css';
import './TableCell.css';
import { useDispatch, useSelector } from 'react-redux';
import { removeLineMinuteObject } from '../vars/removeLineMinuteObject';
import { changeAttdRecModalInfo } from '../../../../../redux/modules/attdRecModalInfo';
import { changeAttdDetailModalInfo } from '../../../../../redux/modules/attdDetailModalInfo';
import { changeContentModalInfo } from '../../../../../redux/modules/schedule/mul/contentModalInfo';
import { changeEditModalInfo } from '../../../../../redux/modules/schedule/mul/editModalInfo';
import { changeDeleteModalInfo } from '../../../../../redux/modules/schedule/mul/deleteModalInfo';
import { getDateTimeStamp } from 'commons/functions/getDateTimeStamp';
import Api from 'api/dataControllerApi';

const TableCell = (props) => {
  const {
    date,
    curDate,
    curHour,
    curMinute,
    startHour,
    schedule,
    cellHeight,
    timeInterval,
    bodyList,
    onChangeBodyList,
  } = props;
  const dispatch = useDispatch();
  const onChangeAttdDetailModalInfo = (attdDetailModalInfo) => dispatch(changeAttdDetailModalInfo(attdDetailModalInfo));
  const onChangeMulContentModalInfo = (contentModalInfo) => dispatch(changeContentModalInfo(contentModalInfo));
  const onChangeAttdRecModalInfo = (attdRecModalInfo) => dispatch(changeAttdRecModalInfo(attdRecModalInfo));
  const onChangeEditModalInfo = (editModalInfo) => dispatch(changeEditModalInfo(editModalInfo));
  const onChangeDeleteModalInfo = (deleteModalInfo) => dispatch(changeDeleteModalInfo(deleteModalInfo));

  const token = useSelector((state) => state.token);
  const header = useMemo(() => {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, [token]);

  const clickedTeacherInfo = useSelector((state) => state.clickedTeacherInfo);
  const week = useSelector((state) => state.week);
  const cellHour = parseInt(startHour.slice(0, 2));
  const cellMinute = startHour.length === 2 ? 0 : parseInt(startHour.slice(2));

  let removeLineMinute = removeLineMinuteObject[timeInterval];

  let cellStyle = null;
  if (schedule && !schedule.clicked) {
    cellStyle = {
      width: '103px',
      height:
        ((schedule.endHour - schedule.startHour) * 6 + (schedule.endMinute - schedule.startMinute) / 10) * cellHeight -
        1 +
        'px',
      backgroundColor: schedule.color,
    };
  } else if (schedule && schedule.clicked) {
    cellStyle = {
      width: '103px',
      height:
        ((schedule.endHour - schedule.startHour) * 6 + (schedule.endMinute - schedule.startMinute) / 10) * cellHeight -
        1 -
        2 +
        'px',
      backgroundColor: schedule.color,
      border: '1px solid #6c3ae0',
    };
  }

  const onAttdRecClick = async (id) => {
    // 출석 기록
    if (JSON.parse(window.localStorage.getItem('courseId')) === null) {
      window.localStorage.setItem('courseId', JSON.stringify(id));
      const startDate = getDateTimeStamp();
      window.localStorage.setItem('startDate', JSON.stringify(startDate));

      onChangeAttdRecModalInfo({
        show: true,
        mode: 'REC_START',
        startDate,
        endDate: '',
        content: `${startDate} 기록을 시작합니다.`,
      });
    } else if (JSON.parse(window.localStorage.getItem('courseId')) === id) {
      // 출석 기록 종료
      const endDate = getDateTimeStamp();
      const startDate = JSON.parse(window.localStorage.getItem('startDate'));
      const courseId = JSON.parse(window.localStorage.getItem('courseId'));

      const startTime = startDate.split(' ')[1];
      const endTime = endDate.split(' ')[1];
      let res;
      if (schedule.regular === true) {
        res = await Api.postschedule(
          '/adminApi/signUp/students/classTime',
          {
            end_time: endTime,
            sign_up_id: courseId,
            start_time: startTime,
          },
          header,
        );
      } else {
        res = await Api.postData(
          '/adminApi/signUp/students/makeUpLesson/classTime',
          {
            end_class_date: schedule.endClassDate,
            end_time: endTime,
            make_up_lesson_id: courseId,
            start_time: startTime,
          },
          header,
        );
      }
      if (res.data.description === '등록성공') {
        localStorage.removeItem('courseId');
        localStorage.removeItem('startDate');

        // 서버에 날짜 및 시간 보내기!

        onChangeAttdRecModalInfo({
          show: true,
          mode: 'REC_END',
          startDate,
          endDate,
          content: `'${endDate}' 기록을 종료합니다.`,
        });
      } else {
        // handling error
      }
    } else {
      onChangeAttdRecModalInfo({
        show: false,
        mode: '',
        startDate: '',
        endDate: '',
        content: '',
      });
    }
  };
  const onAttdDetailClick = async (id) => {
    const res = await Api.getData(`/adminApi/signUp/student/attendance/${id}`, header);
    if (res.data.description === '조회성공') {
      onChangeAttdDetailModalInfo({
        show: true,
        data: res.data.data,
      });
    } else {
      // handling error
    }
  };

  const onClickSchedule = (e, schedule) => {
    // 무슨 함수?
    e.stopPropagation();
    //  "left": e.pageX + 'px',
    //                 "top": e.pageY + 'px'
    onChangeBodyList(
      bodyList.map((data) => (data.id === schedule.id ? { ...data, clicked: true } : { ...data, clicked: false })),
    );
  };
  let _curMinute = curMinute - 10;
  let _curHour = curHour;
  if (_curMinute < 0) {
    _curMinute += 60;
    _curHour -= 1;
  }
  const isCurrentTime = week === 0 && _curHour === cellHour && _curMinute === cellMinute;
  let dropDownText = [];
  if (clickedTeacherInfo && clickedTeacherInfo.funct === 'ATTENDANCE') {
    dropDownText = [{ id: 1, text: '출석 기록', onClick: () => onAttdRecClick(schedule.id) }];
    if (schedule && schedule.regular) {
      dropDownText.push({
        id: 2,
        text: '상세 보기',
        onClick: () => onAttdDetailClick(schedule.id),
      });
    }
  } else if (clickedTeacherInfo && clickedTeacherInfo.funct === 'MAKEUPLESSON') {
    dropDownText = [
      {
        id: 1,
        text: '보강 상담 보기',
        onClick: () =>
          onChangeMulContentModalInfo({
            show: true,
            data: { id: schedule.consultId },
          }),
      },
      {
        id: 2,
        text: '보강 일정 수정',
        onClick: () =>
          onChangeEditModalInfo({ show: true, data: { lessonId: schedule.lessonId, consultId: schedule.consultId } }),
      },
      {
        id: 3,
        text: '보강 일정 삭제',
        onClick: () => onChangeDeleteModalInfo({ show: true, data: { id: schedule.lessonId } }),
      },
    ];
  } else if (clickedTeacherInfo && clickedTeacherInfo.funct === 'COUNSEL') {
    dropDownText = [];
  }

  return (
    <div
      className="weekly-cell"
      style={{
        height: cellHeight,

        borderBottom: removeLineMinute.includes(cellMinute) ? 'none' : isCurrentTime ? '1px solid #6c3ae0' : null,

        backgroundColor: date === curDate ? '#f2f5f7' : null,
      }}
    >
      {schedule ? (
        <div className="weekly-schedule" style={cellStyle} onClick={(e) => onClickSchedule(e, schedule)}>
          <div
            className="weekly-schedule-dropdown"
            style={schedule.clicked ? { display: 'inline-block' } : { display: 'none' }}
          >
            {dropDownText.map((data) => (
              <button className="weekly-schedule-dropdown-button" key={data.id} onClick={data.onClick}>
                {data.text}
              </button>
            ))}
          </div>

          <div className="weekly-schedule-info">
            {<h4>{schedule.studentName + '(' + schedule.studentAccount + ')'}</h4>}
            {
              <p>
                {'시간: ' +
                  schedule.startHour +
                  ':' +
                  schedule.startMinute +
                  '~' +
                  schedule.endHour +
                  ':' +
                  schedule.endMinute}
                <br></br>
                {'요일: ' + schedule.days}
                <br></br>
                {'강사: ' + schedule.tutorName}
              </p>
            }
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TableCell;
