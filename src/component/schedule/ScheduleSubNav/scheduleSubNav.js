import React, { useEffect, useState } from 'react';
import './scheduleSubNav.css';
import { ScheduleSubNavCourse } from './ScheduleSubNavCourse/ScheduleSubNavCourse';
import { ScheduleSubNavMakeUpLesson } from './ScheduleSubNavMakeUpLesson/ScheduleSubNavMakeUpLesson';
import { ScheduleSubNavCounsel } from './ScheduleSubNavCounsel/ScheduleSubNavCounsel';
import { useDispatch, useSelector } from 'react-redux';
import { changeselectedSubjectId } from '../../../redux/modules/attendance/selectedSubjectId';
import { changeSubNavList } from '../../../redux/modules/schedule/subNavList';
import { changefilterModalInfo } from 'redux/modules/schedule/filterModalInfo';

//test
// 가운데 레이아웃 학생 검색이 있는 부분
function ScheduleSubNav() {
  const dispatch = useDispatch();
  const onChangeSelectedSubjectId = (selectedSubjectId) => dispatch(changeselectedSubjectId(selectedSubjectId));
  const subNavList = useSelector((state) => state.subNavList);
  const onChangeSubNavList = (subNavList) => dispatch(changeSubNavList(subNavList));
  const clickedTeacherInfo = useSelector((state) => state.clickedTeacherInfo);
  const selectedSubjectId = useSelector((state) => state.selectedSubjectId);
  const onChangeFilterModalInfo = (filterModalInfo) => dispatch(changefilterModalInfo(filterModalInfo));

  return (
    <div className="Schedule__SubNav">
      <div className="Schedule__SubNavHeader">
        <span className="Schedule__InputLabel">과목 및 날짜 검색</span>
        <button
          className="Schedule__InputButton"
          onClick={() => {
            if (clickedTeacherInfo && clickedTeacherInfo.funct !== '')
              onChangeFilterModalInfo({ show: true, data: { id: clickedTeacherInfo.id } });
          }}
        >
          과목 및 날짜 검색
        </button>
        <span className="Schedule__InputLabel">학생 검색</span>
        <input className="Schedule__InputSearch" placeholder="검색" />
      </div>
      <div className="Schedule__SubNavContent">
        {/* 강사 기능이 "출석 관리"인 경우 */}
        {clickedTeacherInfo && clickedTeacherInfo.funct === 'ATTENDANCE' && (
          <ScheduleSubNavCourse subNavList={subNavList} onChangeSubNavList={onChangeSubNavList} />
        )}
        {clickedTeacherInfo && clickedTeacherInfo.funct === 'MAKEUPLESSON' && (
          <ScheduleSubNavMakeUpLesson subNavList={subNavList} onChangeSubNavList={onChangeSubNavList} />
        )}
        {clickedTeacherInfo && clickedTeacherInfo.funct === 'COUNSEL' && (
          <ScheduleSubNavCounsel subNavList={subNavList} onChangeSubNavList={onChangeSubNavList} />
        )}
      </div>
    </div>
  );
}

export default ScheduleSubNav;
