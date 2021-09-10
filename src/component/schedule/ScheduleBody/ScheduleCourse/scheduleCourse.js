import React from 'react';
import './scheduleCourse.css';

function ScheduleCourse({ title }) {
  const date = [
    { date_name: 'monday', date_kor: '월' },
    { date_name: 'tuesday', date_kor: '화' },
    { date_name: 'wednesday', date_kor: '수' },
    { date_name: 'thursday', date_kor: '목' },
    { date_name: 'friday', date_kor: '금' },
    { date_name: 'saturday', date_kor: '토' },
    { date_name: 'sunday', date_kor: '일' },
  ];

  const dateOption = date.map((date, index) => {
    return (
      <div className="ScheduleCourse__SelectCourseDate" key={index}>
        <label
          className="ScheduleCourse__DateLabel"
          htmlFor="CourseCRUD__CheckDate"
        >
          {date.date_kor}
        </label>
        <input
          type="checkbox"
          className="ScheduleCourse__CheckDate"
          name={date.date_name}
        />
      </div>
    );
  });

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
          <div className="ScheduleCourse__SubjectInputWrap">
            <div className="ScheduleCourse__InputLabel">과목 리스트</div>
            <input
              className="ScheduleCourse__Input"
              placeholder="과목 리스트"
            />
          </div>
          <div className="ScheduleCourse__StudentInputWrap">
            <div className="ScheduleCourse__InputLabel">학생명</div>
            <input className="ScheduleCourse__Input" placeholder="학생명" />
          </div>
          <div className="ScheduleCourse__DateInputWrap">
            <div className="ScheduleCourse__InputLabel">수강 요일</div>
            <div className="ScheduleCourse__DateInput" placeholder="수강 요일">
              {dateOption}
            </div>
          </div>
          <div className="ScheduleCourse__TimeInputWrap">
            <div className="ScheduleCourse__InputLabel">과목 리스트</div>
            <div className="ScheduleCourse__TimeInputContent">
              <input className="ScheduleCourse__TimeInput" placeholder="00" />
              <span className="ScheduleCourse__TimeInputLabel">시</span>
              <input className="ScheduleCourse__TimeInput" placeholder="00" />
              <span className="ScheduleCourse__TimeInputLabel">분</span>
              <span className="ScheduleCourse__TimeInputLabel">~</span>
              <input className="ScheduleCourse__TimeInput" placeholder="00" />
              <span className="ScheduleCourse__TimeInputLabel">시</span>
              <input className="ScheduleCourse__TimeInput" placeholder="00" />
              <span className="ScheduleCourse__TimeInputLabel">분</span>
            </div>
          </div>
        </div>
        <div className="ScheduleCourse__Foot">
          <button className="ScheduleCourse__Delete">삭제</button>
          <button className="ScheduleCourse__Register">등록</button>
        </div>
        <div className="ScheduleCourse__TopBottomStyle"></div>
      </div>
    </div>
  );
}

export default ScheduleCourse;
