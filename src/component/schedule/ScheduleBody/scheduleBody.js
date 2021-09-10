import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './scheduleBody.css';
import ScheduleCourse from './ScheduleCourse/scheduleCourse';
import CourseTable from './CourseTable/CourseTable';
import { useDispatch, useSelector } from 'react-redux';
import { changeWeek } from '../../../redux/modules/week';
import { DAY_TO_KOR, ENG_DAYS, KOR_DAYS } from '../../common/vars/vars';
import courseData from '../../../commons/test/teacherManage/attendance/course';
import makeUpLessonData from '../../../commons/test/teacherManage/attendance/makeUpLesson';
import axios from 'axios';
import getUrl from '../../../commons/functions/getUrl';
import getFormatDate from '../../../commons/functions/getFormatDate';
import { changeBodyList } from '../../../redux/modules/schedule/bodyList';
import ScheduleModal from '../commons/SchduleModal';
import Api from 'api/dataControllerApi';
import getMakeUpLessonUrl from 'commons/functions/getUrl/schedule/getMakeUpLessonUrl';
import getCourseUrl from 'commons/functions/getUrl/schedule/getCourseUrl';
// 가장 오른쪽 레이아웃 일정표가 있는 부분
function ScheduleBody() {
  const [show_course, setShowCourse] = useState(false);
  const [timeInterval, setTimeInterval] = useState('60');
  const bodyList = useSelector((state) => state.bodyList);
  const dispatch = useDispatch();
  const onChangeBodyList = useCallback((bodyList) => dispatch(changeBodyList(bodyList)), []);
  const clickedTeacherInfo = useSelector((state) => state.clickedTeacherInfo);
  const selectedSubjectId = useSelector((state) => state.selectedSubjectId);
  const token = useSelector((state) => state.token);
  const header = useMemo(() => {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, [token]);

  const getWeekOfMonth = (date) => {
    const selectedDayOfMonth = date.getDate();
    const first = new Date(date.getFullYear() + '/' + (date.getMonth() + 1) + '/01');
    const monthFirstDateDay = first.getDay();
    return Math.ceil((selectedDayOfMonth + monthFirstDateDay) / 7);
  };

  const monthWeeks = useMemo(() => {
    const date = new Date();
    const temp = [];

    for (let i = -3; i < 4; i++) {
      const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7 * i);
      const month = newDate.getMonth() + 1;
      const week = getWeekOfMonth(newDate);
      temp.push({ month, week });
    }
    return temp;
  }, []);

  const mode = useSelector((state) => state.mode);

  const onChangeWeek = (num) => dispatch(changeWeek(num));

  const addCourse = () => {
    setShowCourse(true);
  };

  const handleTimeInterval = (e) => {
    setTimeInterval(e.target.value);
  };

  const getData = useCallback(async () => {
    const date = new Date();

    const startDate = getFormatDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7 * -3));
    const endDate = getFormatDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7 * 3));

    if (clickedTeacherInfo && clickedTeacherInfo.funct === 'ATTENDANCE' && selectedSubjectId) {
      let _tableList = [];
      const res1 = await Api.getData(
        getCourseUrl(endDate, startDate, selectedSubjectId, clickedTeacherInfo.id),
        header,
      );
      if (res1.data.description === '조회성공') {
        res1.data.data.forEach((data) => {
          let days = [];
          ENG_DAYS.forEach((eng_day) => {
            if (data[eng_day]) {
              days = days.concat(DAY_TO_KOR[eng_day]);
            }
          });

          const _course = {
            regular: true,
            id: data.sign_up_id,
            studentName: data.student_name,
            studentAccount: data.student_account,
            startTime: data.start_time,
            endTime: data.end_time,
            days,
            tutorName: clickedTeacherInfo.name,
            clicked: false,
            startClassDate: data.class_start_time,
            endClassDate: data.class_end_time,
          };
          _tableList = _tableList.concat(_course);
        });
      } else {
        // handling error
      }
      const res2 = await Api.getData(
        getMakeUpLessonUrl(endDate, startDate, selectedSubjectId, clickedTeacherInfo.id),
        header,
      );
      if (res2.data.description === '조회성공') {
        res2.data.data.forEach((data) => {
          const date = new Date(data.start_class_time);
          let days = [KOR_DAYS[date.getDay()]];

          const _course = {
            regular: false,
            id: data.make_up_lesson_id,
            studentName: data.student_name,
            studentAccount: data.student_account,
            startTime: data.start_time,
            endTime: data.end_time,
            days,
            tutorName: data.user_name,
            clicked: false,
            startClassDate: data.start_class_time,
            endClassDate: data.start_class_time,
          };
          _tableList = _tableList.concat(_course);
        });
      } else {
        // handling error
      }
      onChangeBodyList(_tableList);
    } else if (clickedTeacherInfo && clickedTeacherInfo.funct === 'MAKEUPLESSON' && selectedSubjectId) {
      let _tableList = [];
      const res = await Api.getData(
        getMakeUpLessonUrl(endDate, startDate, selectedSubjectId, clickedTeacherInfo.id),
        header,
      );
      if (res.data.description === '조회성공') {
        res.data.data.forEach((data) => {
          const date = new Date(data.start_class_time);
          let days = [KOR_DAYS[date.getDay()]];
          const _course = {
            regular: false,
            lessonId: data.make_up_lesson_id,
            consultId: data.consult_id,
            studentName: data.student_name,
            studentAccount: data.student_account,
            startTime: data.start_time,
            endTime: data.end_time,
            days,
            tutorName: data.user_name,
            clicked: false,
            startClassDate: data.start_class_time,
            endClassDate: data.start_class_time,
          };
          _tableList = _tableList.concat(_course);
        });
      } else {
        // handling error
      }
      onChangeBodyList(_tableList);
    } else if (clickedTeacherInfo && clickedTeacherInfo.funct === 'COUNCEL' && selectedSubjectId) {
      const res = axios.get('');
      if (res.description === '조회성공') {
      } else {
      }
    } else {
      onChangeBodyList(null);
    }
  }, [clickedTeacherInfo, header, selectedSubjectId, onChangeBodyList]);

  useEffect(() => {
    getData();
  }, [getData]);
  return (
    <div className="Schedule__Body">
      <ScheduleModal />
      {show_course ? <ScheduleCourse title="수강 보기" /> : null}
      <span className="Schedule__InputLabel">현재의 시간표는</span>
      <div className="Schedule__BodyHeader">
        <div className="Schedule__BodyHeaderTeacherNameWrap">
          <span className="Schedule__BodyTeacherName">{clickedTeacherInfo ? clickedTeacherInfo.name : 'O O O'}</span>
          <span className="Schedule__BodyTeacherNameLabel">님의 시간표 입니다</span>
        </div>
        <div className="Schedule__BodyHeaderButtonWrap">
          <button className="Schedule__BodyButtonAdd" onClick={mode === 'COURSE' ? addCourse : null}>
            추가
          </button>
          <button className="Schedule__BodyButtonDelete">삭제</button>
          <select className="Schedule__BodySelectDistance" onChange={handleTimeInterval}>
            <option value="60">시간 간격</option>
            <option value="10">10분</option>
            <option value="20">20분</option>
            <option value="30">30분</option>
          </select>
          <button className="Schedule__BodyButtonWeek">주간</button>
          <button className="Schedule__BodyButtonMonth">월간</button>
          <select className="Schedule__BodySelectStage" onChange={(e) => onChangeWeek(parseInt(e.target.value))}>
            {monthWeeks.map((monthWeek, index) => (
              <option value={index - 3} key={index} selected={index - 3 === 0 ? true : false}>
                {monthWeek.month + '월 ' + monthWeek.week + '주차'}
              </option>
            ))}
          </select>
        </div>
      </div>
      <CourseTable timeInterval={timeInterval} bodyList={bodyList} onChangeBodyList={onChangeBodyList} />
    </div>
  );
}

export default ScheduleBody;
