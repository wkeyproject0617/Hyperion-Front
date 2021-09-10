import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeNavList } from '../../../../redux/modules/schedule/navList';

// 네비게이션 모드가 COURSE인 경우 보여지는 레이아웃
export default function ScheduleNavCourse() {
  const navList = useSelector((state) => state.navList);
  const dispatch = useDispatch();
  const onChangeNavList = (navList) => dispatch(changeNavList(navList));

  // 미배정 학생 가져오기
  const getStudent = useCallback(async () => {
    // const res = await axios.get('');
    // if (res.description === '조회 성공') {
    //   setTeacherList(
    //     res.data.map((data) => {
    //       return {
    //         id: data.user_id,
    //         name: data.user_name,
    //         account: data.user_account,
    //       };
    //     }),
    //   );
    // } else {
    //   // handling error
    // }
    // // 운영자이름과 강사 리스트 가져오기
    // // url 주소 바뀐 것 같음, 서버 통신 테스트할 때 확인해보기
    // // 강사 리스트 조회
    // Api.getData('/adminApi/userSearch?name=', header).then((res) => {
    //   if (res.data.description === '조회성공') {
    //     const teacher_list = res.data.data.map((data) => {
    //       return {
    //         id: data.user_id,
    //         name: data.user_name,
    //         account: data.user_account,
    //         fold: true,
    //         funct: 'ATTENDANCE',
    //       };
    //     });
    //     // 강사 리스트 지정
    //     onChangeTeacherList(teacher_list);
    //   } else {
    //     CheckToken(refreshToken, token, setToken, res);
    //   }
    // });
    onChangeNavList([]);
  }, []);

  useEffect(() => {
    getStudent();
  }, [getStudent]);

  return <div className="Schedule__NavCourse"></div>;
}
