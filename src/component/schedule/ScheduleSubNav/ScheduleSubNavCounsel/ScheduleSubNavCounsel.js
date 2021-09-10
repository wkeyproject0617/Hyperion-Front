import { useSelector } from 'react-redux';
import NavCouncelFunctions from './NavCouncelFunctions/NavCouncelFunctions';

export const ScheduleSubNavCounsel = ({ subNavList, onChangeSubNavList }) => {
  // 수업을 클릭했을시 스케줄에서 해당 수 업 표시

  const clickedTeacherInfo = useSelector((state) => state.clickedTeacherInfo);
  const onCourseClick = (id) => {
    onChangeSubNavList(
      subNavList.map((data) => {
        return data.id === id ? { ...data, clicked: true } : { ...data, clicked: false };
      }),
    );
  };
  console.log(subNavList);
  const course_List = subNavList.map((data) => {
    let nameStyle = null;
    if (data.consulted && data.clicked) {
      nameStyle = { border: '2px solid #9162FF', backgroundColor: 'rgb(242, 245, 247)', paddingBottom: '0px' };
    } else if (!data.consulted && data.clicked) {
      nameStyle = { border: '2px solid #9162FF', paddingBottom: '0px' };
    } else if (data.consulted && !data.clicked) {
      nameStyle = { backgroundColor: 'rgb(242, 245, 247)' };
    }
    console.log(data);
    return (
      <div className="Schedule__CourseWrap" onClick={onCourseClick.bind(this, data.id)} key={data.id} style={nameStyle}>
        <div className="Schedule__CourseInfo">
          <div className="Schedule__Course__studentName">
            {'학생명: ' + data.studentName + ' (' + data.studentAccount + ')'}
          </div>
          <div className="Schedule__Course__SubInfo">
            {'상담 일자: ' + data.consultDay.replaceAll('-', '/')}
            <br></br>
            {'상담 강사 : ' + clickedTeacherInfo.name}
          </div>
          {/* CLICKED인 경우 해당 수업의 기능이 보여짐 */}
          {data.clicked ? <NavCouncelFunctions data={data} /> : null}
        </div>
      </div>
    );
  });
  return <div className="Schedule__SubNavCourse">{course_List}</div>;
};
