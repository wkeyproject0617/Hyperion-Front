import React from 'react';
import './scheduleNav.css';
import ScheduleNavTeacher from './ScheduleNavTeacher/ScheduleNavTeacher';
import ScheduleNavCourse from './ScheduleNavCourse/ScheduleNavCourse';
import { useDispatch, useSelector } from 'react-redux';
import { changeClickedTeacherInfo } from '../../../redux/modules/schedule/clickedTeacherInfo';
import { changeSubNavList } from '../../../redux/modules/schedule/subNavList';
import { changeBodyList } from '../../../redux/modules/schedule/bodyList';
import { changeselectedSubjectId } from '../../../redux/modules/attendance/selectedSubjectId';
import { changeMode } from '../../../redux/modules/schedule/mode';
// 가장 왼쪽 레이아웃 강사 리스트가 있는 부분
function ScheduleNav() {
  const mode = useSelector((state) => state.mode);
  const dispatch = useDispatch();
  const onChangeMode = (mode) => dispatch(changeMode(mode));
  const onChangeClickedTeacherInfo = (clickedTeacherInfo) => dispatch(changeClickedTeacherInfo(clickedTeacherInfo));
  const onChangeSubNavList = (subNavList) => dispatch(changeSubNavList(subNavList));
  const onChangeBodyList = (bodyList) => dispatch(changeBodyList(bodyList));
  const onChangeSelectedSubjectId = (selectedSubjectId) => dispatch(changeselectedSubjectId(selectedSubjectId));
  //버튼을 누르면 해당 스타일로 변경된다
  const clickedNavButtonStyle = {
    background: '#9162FF',
  };

  return (
    <div className="Schedule__Nav">
      <div className="Schedule__NavHeader">
        {/* 유저 정보 */}
        <span className="Schedule__UserName">조우빈 강사님</span>
        <span className="Schedule__StateMessage">Easy Sunny English Class</span>
        <span className="Schedule__Grade">Admin</span>
      </div>
      <div className="Schedule__NavButtonWrap">
        {/* 네비게이션 모드를 지정한다 */}
        <button
          className="Schedule__NavButton"
          onClick={() => {
            onChangeClickedTeacherInfo(null);
            onChangeMode('TEACHER');
          }}
          style={mode === 'TEACHER' ? clickedNavButtonStyle : null}
        >
          강사 관리
        </button>
        <button
          className="Schedule__NavButton"
          onClick={() => {
            onChangeClickedTeacherInfo(null);
            onChangeSubNavList([]);
            onChangeBodyList([]);
            onChangeSelectedSubjectId(null);
            onChangeMode('COURSE');
          }}
          style={mode === 'COURSE' ? clickedNavButtonStyle : null}
        >
          수강 관리
        </button>
      </div>
      <div className="Schedule__NavContent">
        {/* 모드에 따라 레이아웃이 변경된다 */}
        {mode === 'TEACHER' ? <ScheduleNavTeacher /> : <ScheduleNavCourse />}
      </div>
    </div>
  );
}

export default ScheduleNav;
