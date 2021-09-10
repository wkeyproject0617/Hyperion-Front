import React from 'react';
import './NormalModal.css';

function TestModal({ title, onClose, onExec }) {
  return (
    <div className="ScheduleCourse">
      <div className="ScheduleCourse__ContentWrap">
        <div className="ScheduleCourse__TopBottomStyle"></div>
        <div className="ScheduleCourse__Header">{title}</div>
        <div className="ScheduleCourse__Content">
          <div className="ScheduleCourse__TeacherInputWrap">
            <div className="ScheduleCourse__InputLabel">강사명</div>
            <input className="ScheduleCourse__Input" placeholder="강사명" />
          </div>
          {/* {clickedTeacherInfo.funct !== 'COUNSEL' && (
            <div className="ScheduleCourse__SubjectInputWrap">
              <div className="ScheduleCourse__InputLabel">과목 선택</div>
              <select
                className="ScheduleCourse__Input"
                onChange={(e) => {
                  setClickedSubjectId(e.target.value);
                }}
              >
                <option value="" disabled selected>
                  과목 구분 | 과목 레벨 | 과목명
                </option>
                {subjectList.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.title}
                  </option>
                ))}
              </select>
              <span>검색할 과목을 선택해주세요</span>
            </div>
          )} */}
          {/* <div className="ScheduleCourse__DateInputWrap">
            <div className="ScheduleCourse__InputLabel">날짜 조회기간</div>
            <div className="ScheduleCourse__DateInput" placeholder="수강 요일">
              {dateOption}
            </div>
          </div> */}
          <div className="ScheduleCourse__TimeInputWrap">
            <div className="ScheduleCourse__InputLabel">날짜 조회기간</div>
            <div className="ScheduleCourse__TimeInputContent">
              {/* <button
                className="ScheduleCourse__TimePeriod"
                onClick={() => setClickedPeriod(1)}
                style={{ borderColor: clickedPeriod === 1 ? '#9162FF' : null }}
              >
                1개월
              </button>
              <button
                className="ScheduleCourse__TimePeriod"
                onClick={() => setClickedPeriod(3)}
                style={{ borderColor: clickedPeriod === 3 ? '#9162FF' : null }}
              >
                3개월
              </button>
              <button
                className="ScheduleCourse__TimePeriod"
                onClick={() => setClickedPeriod(6)}
                style={{ borderColor: clickedPeriod === 6 ? '#9162FF' : null }}
              >
                6개월
              </button>
              <button
                className="ScheduleCourse__TimePeriod"
                onClick={() => setClickedPeriod(12)}
                style={{ borderColor: clickedPeriod === 12 ? '#9162FF' : null }}
              >
                1년
              </button> */}
            </div>
            <span>조회기간을 선택해주세요</span>
          </div>
        </div>
        <div className="ScheduleCourse__Foot">
          <button className="ScheduleCourse__Delete" onClick={onClose}>
            취소
          </button>
          <button className="ScheduleCourse__Register" onClick={onExec}>
            기능
          </button>
        </div>
        <div className="ScheduleCourse__TopBottomStyle"></div>
      </div>
    </div>
  );
}

export default TestModal;
