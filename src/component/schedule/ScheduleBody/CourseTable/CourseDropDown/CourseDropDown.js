import './CourseDropDown.css';

function CourseDropDown() {
  return (
    <div className="Container">
      <button onClick={(e) => console.log(e.clientY)}>출석 기록</button>
      <button>상세 보기</button>
    </div>
  );
}

export default CourseDropDown;
