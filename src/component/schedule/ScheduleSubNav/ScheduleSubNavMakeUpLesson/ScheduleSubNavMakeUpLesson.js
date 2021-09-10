import NavMakeUpLessonFunctions from './NavMakeUpLessonFunctions/NavMakeUpLessonFunctions';

export const ScheduleSubNavMakeUpLesson = ({ subNavList, onChangeSubNavList }) => {
  const onCourseClick = (id) => {
    onChangeSubNavList(
      subNavList.map((data) => {
        return data.consultId === id ? { ...data, clicked: true } : { ...data, clicked: false };
      }),
    );
  };
  const mulcouncel_List = subNavList.map((data) => {
    let nameStyle = null;
    if (data.schedule && data.clicked) {
      nameStyle = { border: '2px solid #9162FF', backgroundColor: 'rgb(242, 245, 247)' };
    } else if (!data.schedule && data.clicked) {
      nameStyle = { border: '2px solid #9162FF' };
    } else if (data.schedule && !data.clicked) {
      nameStyle = { backgroundColor: 'rgb(242, 245, 247)' };
    }
    return (
      <div
        className="Schedule__MakeUpLessonWrap"
        onClick={onCourseClick.bind(this, data.consultId)}
        key={data['consult_id']}
        // style={data.clicked ? { background: '#FFB6AF', paddingBottom: '0px' } : null}
      >
        <div className="Schedule__MakeUpLessonInfo">
          <div className="Schedule__MakeUpLesson__studentName" style={nameStyle}>
            {'학생명: ' + data.studentName + ' (' + data.studentAccount + ')'}
          </div>

          {data.clicked ? <NavMakeUpLessonFunctions data={data} /> : null}
        </div>
      </div>
    );
  });
  return <div className="Schedule__SubNavMakeUpLesson">{mulcouncel_List}</div>;
};
