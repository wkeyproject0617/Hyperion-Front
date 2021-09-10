import NavCourseFunctions from './NavCourseFunctions/NavCourseFunctions';

export const ScheduleSubNavCourse = ({ subNavList, onChangeSubNavList }) => {
  // 수업을 클릭했을시 스케줄에서 해당 수 업 표시
  const onCourseClick = (id) => {
    onChangeSubNavList(
      subNavList.map((data) => {
        return data.id === id ? { ...data, clicked: true } : { ...data, clicked: false };
      }),
    );
  };

  const course_List = subNavList.map((data) => {
    let nameStyle = null;
    if (data.regular && data.clicked) {
      nameStyle = { border: '2px solid #9162FF', paddingBottom: '0px' };
    } else if (!data.regular && data.clicked) {
      nameStyle = { border: '2px solid #9162FF', backgroundColor: 'rgb(242, 245, 247)', paddingBottom: '0px' };
    } else if (!data.regular && !data.clicked) {
      nameStyle = { backgroundColor: 'rgb(242, 245, 247)' };
    }

    return (
      <div className="Schedule__CourseWrap" onClick={onCourseClick.bind(this, data.id)} key={data.id} style={nameStyle}>
        <div className="Schedule__CourseInfo">
          <div className="Schedule__Course__studentName">
            {'학생명: ' + data.studentName + ' (' + data.studentAccount + ')'}
          </div>
          <div className="Schedule__Course__SubInfo">
            {!data.regular ? ['수업날짜 : ' + data.startClassDate, <br></br>] : null}
            {'수업시간 : ' + data.startTime + '~' + data.endTime}
            <br></br>

            {'수업요일 : ' + data.days}
            <br></br>
            {'배정강사 : ' + data.tutorName}
          </div>
          {/* CLICKED인 경우 해당 수업의 기능이 보여짐 */}
          {data.clicked ? <NavCourseFunctions data={data} /> : null}
        </div>
      </div>
    );
  });
  return <div className="Schedule__SubNavCourse">{course_List}</div>;
};
