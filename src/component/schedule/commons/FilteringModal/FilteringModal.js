import axios from 'axios';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './FilteringModal.css';
import subjectListData from '../../../../commons/test/teacherManage/subjectList';
import { useDispatch, useSelector } from 'react-redux';
import { changefilterModalInfo } from 'redux/modules/schedule/filterModalInfo';
import Api from 'api/dataControllerApi';
import getSubjectUrl from 'commons/functions/getUrl/schedule/getSubjectUrl';
import getFormatDate from 'commons/functions/getFormatDate';
import { DAY_TO_KOR, ENG_DAYS, KOR_DAYS } from 'component/common/vars/vars';
import getCourseUrl from 'commons/functions/getUrl/schedule/getCourseUrl';
import getMakeUpLessonCouncelUrl from 'commons/functions/getUrl/schedule/getMakeUpLessonCouncelUrl';
import getNoConsultedUrl from 'commons/functions/getUrl/schedule/getNoConsultedUrl';
import getMakeUpLessonUrl from 'commons/functions/getUrl/schedule/getMakeUpLessonUrl';
import { changeSubNavList } from 'redux/modules/schedule/subNavList';
import { changeselectedSubjectId } from 'redux/modules/attendance/selectedSubjectId';
import getConsultedUrl from 'commons/functions/getUrl/schedule/getConsultedUrl';

function FilteringModal({ title }) {
  const [clickedPeriod, setClickedPeriod] = useState(1);
  const [subjectList, setSubjectList] = useState([]);
  const [clickedSubjectId, setClickedSubjectId] = useState(null);
  const clickedTeacherInfo = useSelector((state) => state.clickedTeacherInfo);
  const filterModalInfo = useSelector((state) => state.filterModalInfo);
  const dispatch = useDispatch();
  const onChangeFilterModalInfo = (filterModalInfo) => dispatch(changefilterModalInfo(filterModalInfo));
  const onChangeSubNavList = (subNavList) => dispatch(changeSubNavList(subNavList));
  const onChangeSelectedSubjectId = (selectedSubjectId) => dispatch(changeselectedSubjectId(selectedSubjectId));

  const token = useSelector((state) => state.token);
  const header = useMemo(() => {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, [token]);

  const handleSearch = async () => {
    const nowDate = new Date();
    const endDate = getFormatDate(nowDate);
    const startDate = getFormatDate(
      new Date(nowDate.getFullYear(), nowDate.getMonth() - clickedPeriod, nowDate.getDate()),
    );

    let _subNavList = [];
    if (clickedTeacherInfo.funct === 'ATTENDANCE') {
      // ?????? ?????? ????????????
      const res1 = await Api.getData(getCourseUrl(endDate, startDate, clickedSubjectId, clickedTeacherInfo.id), header);

      if (res1.data.description === '????????????') {
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
          _subNavList = _subNavList.concat(_course);
        });
        // ?????? ?????? ????????????
        const res2 = await Api.getData(
          getMakeUpLessonUrl(endDate, startDate, clickedSubjectId, clickedTeacherInfo.id),
          header,
        );
        if (res2.data.description === '????????????') {
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
            _subNavList = _subNavList.concat(_course);
          });
          onChangeFilterModalInfo({ show: false, data: null });

          onChangeSubNavList(_subNavList);
          onChangeSelectedSubjectId(clickedSubjectId);
        } else {
          // handling error
        }
      } else {
        // handling error
      }
    } else if (clickedTeacherInfo.funct === 'MAKEUPLESSON') {
      // ?????? ????????? ????????? ?????? ?????? ?????? ????????????
      const res1 = await Api.getData(
        getMakeUpLessonCouncelUrl(endDate, startDate, clickedSubjectId, clickedTeacherInfo.id),
        header,
      );
      if (res1.data.description === '????????????') {
        res1.data.data.forEach((data) => {
          const _makeUpLessonCouncel = {
            schedule: false,
            consultId: data.consult_id,
            lectureId: data.lecture_id,
            subjectName: data.subject_category + '/' + data.subject_title + '/' + data.subject_level,

            studentName: data.student_name,
            studentAccount: data.student_account,
            clicked: false,
          };
          _subNavList = _subNavList.concat(_makeUpLessonCouncel);
        });

        // ?????? ????????? ?????? ?????? ????????????
        const res2 = await Api.getData(
          getMakeUpLessonUrl(endDate, startDate, clickedSubjectId, clickedTeacherInfo.id),
          header,
        );
        if (res2.data.description === '????????????') {
          res2.data.data.forEach((data) => {
            const date = new Date(data.start_class_time);
            let days = [KOR_DAYS[date.getDay()]];

            const _course = {
              schedule: true,
              consultId: data.consult_id,
              lessonId: data.make_up_lesson_id,

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
            _subNavList = _subNavList.concat(_course);
          });
          onChangeFilterModalInfo({ show: false, data: null });
          onChangeSubNavList(_subNavList);
          onChangeSelectedSubjectId(clickedSubjectId);
        } else {
          // handling error
        }
      } else {
        // handling error
      }
    } else if (clickedTeacherInfo.funct === 'COUNSEL') {
      // ???????????? ?????? ?????? ????????????
      const res1 = await Api.getData(
        getNoConsultedUrl(endDate, startDate, clickedSubjectId, clickedTeacherInfo.id),
        header,
      );
      if (res1.data.description === '????????????') {
        res1.data.data.forEach((data) => {
          const _noConsulted = {
            consulted: false,
            id: data.consult_id,
            studentName: data.student_name,
            studentAccount: data.student_account,
            consultDay: data.consult_day,
          };
          _subNavList = _subNavList.concat(_noConsulted);
        });

        // ????????? ?????? ????????????
        const res2 = await Api.getData(
          getConsultedUrl(endDate, startDate, clickedSubjectId, clickedTeacherInfo.id),
          header,
        );

        if (res2.data.description === '????????????') {
          res2.data.data.forEach((data) => {
            const _consulted = {
              consulted: true,
              id: data.consulted_id,
              studentName: data.student_name,
              studentAccount: data.student_account,
              consultDay: data.created_at,
            };
            _subNavList = _subNavList.concat(_consulted);
          });
          onChangeFilterModalInfo({ show: false, data: null });

          onChangeSubNavList(_subNavList);
          onChangeSelectedSubjectId(clickedSubjectId);
        } else {
          // handling error
        }
      } else {
        // handling error
      }
    }

    onChangeFilterModalInfo({ show: false, data: null });
  };
  const getSubject = useCallback(
    async (teacherId) => {
      const res = await Api.getData(getSubjectUrl(teacherId), header);
      if (res.data.description === '????????????') {
        setSubjectList(
          res.data.data.map((data) => {
            return {
              id: data.subject_id,
              subjectName: data.subject_category + '/' + data.subject_title + '/' + data.subject_level,
            };
          }),
        );
      } else {
        // handling error
      }
    },
    [header],
  );
  useEffect(() => {
    getSubject(filterModalInfo.data.id);
  }, [getSubject, filterModalInfo]);
  return (
    <div className="ScheduleCourse">
      <div className="ScheduleCourse__ContentWrap">
        <div className="ScheduleCourse__TopBottomStyle"></div>
        <div className="ScheduleCourse__Header">{title}</div>
        <div className="ScheduleCourse__Content">
          <div className="ScheduleCourse__SubjectInputWrap">
            <div className="ScheduleCourse__InputLabel">?????? ??????</div>
            <select
              className="ScheduleCourse__Input"
              onChange={(e) => {
                setClickedSubjectId(e.target.value);
              }}
            >
              <option value="" disabled selected>
                ?????? ?????? | ?????? ?????? | ?????????
              </option>
              {subjectList.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.subjectName}
                </option>
              ))}
            </select>
            <span>????????? ????????? ??????????????????</span>
          </div>

          <div className="ScheduleCourse__TimeInputWrap">
            <div className="ScheduleCourse__InputLabel">?????? ????????????</div>
            <div className="ScheduleCourse__TimeInputContent">
              <button
                className="ScheduleCourse__TimePeriod"
                onClick={() => setClickedPeriod(1)}
                style={{ borderColor: clickedPeriod === 1 ? '#9162FF' : null }}
              >
                1??????
              </button>
              <button
                className="ScheduleCourse__TimePeriod"
                onClick={() => setClickedPeriod(3)}
                style={{ borderColor: clickedPeriod === 3 ? '#9162FF' : null }}
              >
                3??????
              </button>
              <button
                className="ScheduleCourse__TimePeriod"
                onClick={() => setClickedPeriod(6)}
                style={{ borderColor: clickedPeriod === 6 ? '#9162FF' : null }}
              >
                6??????
              </button>
              <button
                className="ScheduleCourse__TimePeriod"
                onClick={() => setClickedPeriod(12)}
                style={{ borderColor: clickedPeriod === 12 ? '#9162FF' : null }}
              >
                1???
              </button>
            </div>
            <span>??????????????? ??????????????????</span>
          </div>
        </div>
        <div className="ScheduleCourse__Foot">
          <button
            className="ScheduleCourse__Delete"
            onClick={() => onChangeFilterModalInfo({ show: false, data: null })}
          >
            ??????
          </button>
          <button
            className="ScheduleCourse__Register"
            onClick={() => {
              if (clickedSubjectId) {
                handleSearch();
              }
            }}
          >
            ??????
          </button>
        </div>
        <div className="ScheduleCourse__TopBottomStyle"></div>
      </div>
    </div>
  );
}

export default FilteringModal;
