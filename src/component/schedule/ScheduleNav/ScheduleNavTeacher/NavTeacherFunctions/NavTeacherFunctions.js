import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { changeselectedSubjectId } from '../../../../../redux/modules/attendance/selectedSubjectId';
import { changeSubNavList } from '../../../../../redux/modules/schedule/subNavList';
import { changeBodyList } from '../../../../../redux/modules/schedule/bodyList';

// 강사가 사용할 기능을 지정한다
export default function NavTeacherFunctions({ data, clickedFunct, onChangeClickedTeacherInfo }) {
  const dispatch = useDispatch();
  const onChangeSelectedSubjectId = (selectedSubjectId) => dispatch(changeselectedSubjectId(selectedSubjectId));
  const clickedTeacherInfo = useSelector((state) => state.clickedTeacherInfo);
  const onChangeBodyList = (bodyList) => dispatch(changeBodyList(bodyList));
  const onChangeSubNavList = (subNabList) => dispatch(changeSubNavList(subNabList));
  // 선택한 기능을 강사에게 배정해 준다
  const onNavFunctionClick = (e) => {
    onChangeBodyList([]);
    onChangeSubNavList([]);
    onChangeSelectedSubjectId(null);
    onChangeClickedTeacherInfo({ ...clickedTeacherInfo, funct: e.target.value });
  };

  // 클릭된 기능의 글자색을 지정해 준다
  const clickedFunctionStyle = {
    color: '#C7AFFF',
  };

  return (
    <div className="Schedule__NavTeacherFunctionWrap">
      <button
        className="Schedule__ButtonNavTeacher"
        value="ATTENDANCE"
        onClick={onNavFunctionClick}
        style={clickedFunct === 'ATTENDANCE' ? clickedFunctionStyle : null}
      >
        출석 관리
      </button>
      <button
        className="Schedule__ButtonNavTeacher"
        value="MAKEUPLESSON"
        onClick={onNavFunctionClick}
        style={clickedFunct === 'MAKEUPLESSON' ? clickedFunctionStyle : null}
      >
        보강 관리
      </button>
      <button
        className="Schedule__ButtonNavTeacher"
        value="COUNSEL"
        onClick={onNavFunctionClick}
        style={clickedFunct === 'COUNSEL' ? clickedFunctionStyle : null}
      >
        상담 관리
      </button>
    </div>
  );
}
