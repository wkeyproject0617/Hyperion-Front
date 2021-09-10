import './NavCouncelFunctions.css';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { changeAttdDetailModalInfo } from '../../../../../redux/modules/attdDetailModalInfo';
import { changeCouncelDetailModalInfo } from '../../../../../redux/modules/councel/councelDetailModalInfo';
// 클릭된 수업의 기능을 지정
export default function NavCouncelFunctions({ data }) {
  const dispatch = useDispatch();
  const onChangeCouncelDetailModalInfo = (councelDetailModalInfo) =>
    dispatch(changeCouncelDetailModalInfo(councelDetailModalInfo));
  console.log(data);
  return (
    <div className="Schedule__Course__NavCourseFunctionWrap">
      <button
        className="Schedule__Course__ButtonNavTeacher"
        value="ATTENDANCE_RECORDING"
        onClick={() => onChangeCouncelDetailModalInfo({ show: true, data: { id: data.id, consulted: data.consulted } })}
      >
        상담 보기
      </button>
    </div>
  );
}
