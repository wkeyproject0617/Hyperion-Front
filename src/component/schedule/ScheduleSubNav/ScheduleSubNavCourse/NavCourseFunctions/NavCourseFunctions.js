import './NavCourseFunctions.css';
import AttdRec from '../../../commons/attendance/AttdRec/AttdRec';
import AttdDetail from '../../../commons/attendance/AttdDetail/AttdDetail';

import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { changeAttdRecModalInfo } from '../../../../../redux/modules/attdRecModalInfo';
import { changeAttdDetailModalInfo } from '../../../../../redux/modules/attdDetailModalInfo';
import { useMemo } from 'react';
import { getDateTimeStamp } from 'commons/functions/getDateTimeStamp';
import Api from 'api/dataControllerApi';
// 클릭된 수업의 기능을 지정
export default function NavCourseFunctions({ data }) {
  const dispatch = useDispatch();
  const onChangeAttdRecModalInfo = (attdRecModalInfo) => dispatch(changeAttdRecModalInfo(attdRecModalInfo));
  const onChangeAttdDetailModalInfo = (attdDetailModalInfo) => dispatch(changeAttdDetailModalInfo(attdDetailModalInfo));
  const attdRecModalInfo = useSelector((state) => state.attdRecModalInfo);
  const token = useSelector((state) => state.token);
  const header = useMemo(() => {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, [token]);
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
      if (data.regular === true) {
        res = await Api.postData(
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
            end_class_date: data.endClassDate,
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

  return (
    <div className="Schedule__Course__NavCourseFunctionWrap">
      <AttdRec />
      <AttdDetail />
      <button
        className="Schedule__Course__ButtonNavTeacher"
        value="ATTENDANCE_RECORDING"
        onClick={() => onAttdRecClick(data.id)}
      >
        출석 기록
      </button>
      {data.regular && (
        <button
          className="Schedule__Course__ButtonNavTeacher"
          value="DETAIL_INFO"
          onClick={() => onAttdDetailClick(data.id)}
        >
          상세 보기
        </button>
      )}
    </div>
  );
}
