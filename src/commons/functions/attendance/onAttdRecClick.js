import { getDateTimeStamp } from '../../../commons/functions/getDateTimeStamp';
import recordingResBodyData from '../../../commons/test/teacherManage/attendance/recordingResBody';
import axios from 'axios';
import Api from 'api/dataControllerApi';

// 기능 클릭 시
// const onAttdRecClick = async (id) => {
const onAttdRecClick = async (id, header) => {
  // 출석 기록
  if (JSON.parse(window.localStorage.getItem('courseId')) === null) {
    window.localStorage.setItem('courseId', JSON.stringify(id));
    const startDate = getDateTimeStamp();
    window.localStorage.setItem('startDate', JSON.stringify(startDate));

    return {
      show: true,
      mode: 'REC_START',
      startDate,
      endDate: '',
      content: `${startDate} 기록을 시작합니다.`,
    };
  } else if (JSON.parse(window.localStorage.getItem('courseId')) === id) {
    // 출석 기록 종료
    const endDate = getDateTimeStamp();
    const startDate = JSON.parse(window.localStorage.getItem('startDate'));
    const courseId = JSON.parse(window.localStorage.getItem('courseId'));

    const startTime = startDate.split(' ')[1];
    const endTime = endDate.split(' ')[1];
    const res = await Api.postData(
      '/adminApi/signUp/students/classTime/',
      {
        end_time: {
          hour: endTime.split(':')[0],
          minute: endTime.split(':')[1],
          nano: 0,
          second: endTime.split(':')[2],
        },
        sign_up_id: courseId,
        start_time: {
          hour: startTime.split(':')[0],
          minute: startTime.split(':')[1],
          nano: 0,
          second: startTime.split(':')[2],
        },
      },
      header,
    );

    if (res.data.description === '등록성공') {
      localStorage.removeItem('courseId');
      localStorage.removeItem('startDate');

      // 서버에 날짜 및 시간 보내기!

      return {
        show: true,
        mode: 'REC_END',
        startDate,
        endDate,
        content: `'${endDate}' 기록을 종료합니다.`,
      };
    } else {
      // handling error
    }
  } else {
    return {
      show: false,
      mode: '',
      startDate: '',
      endDate: '',
      content: '',
    };
  }
};

export default onAttdRecClick;
