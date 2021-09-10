import { useDispatch, useSelector } from 'react-redux';
import NavTeacherFunctions from './NavTeacherFunctions/NavTeacherFunctions';
import { changeClickedTeacherInfo } from '../../../../redux/modules/schedule/clickedTeacherInfo';
import { useCallback, useEffect, useMemo } from 'react';
import { changeNavList } from '../../../../redux/modules/schedule/navList';
import CheckToken from 'api/checkToken';
import Api from 'api/dataControllerApi';
import { changeToken } from 'redux/modules/schedule/token';
// 네비게이션 모드가 TEACHER인 경우 보여지는 레이아웃
export default function ScheduleNavTeacher() {
  // const teacherList = useSelector((state) => state.teacherList);
  const dispatch = useDispatch();

  const onChangeToken = (token) => dispatch(changeToken(token));
  const refreshToken = useSelector((state) => state.refreshToken);
  const clickedTeacherInfo = useSelector((state) => state.clickedTeacherInfo);
  const onChangeClickedTeacherInfo = (clickedTeacherInfo) => dispatch(changeClickedTeacherInfo(clickedTeacherInfo));
  const onChangeCouncelList = (councelList) => dispatch(onChangeCouncelList(councelList));
  const navList = useSelector((state) => state.navList);
  const onChangeNavList = (navList) => dispatch(changeNavList(navList));
  const token = useSelector((state) => state.token);
  const header = useMemo(() => {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, [token]);
  // 강사관리 mode에서 강사 리스트 가져오기
  const getTeacher = useCallback(async () => {
    const res = await Api.getData('/adminApi/userSearch?name=', header);

    if (res.data.description === '조회성공') {
      const teacher_list = res.data.data.map((data) => {
        return {
          id: data.user_id,
          name: data.user_name,
          account: data.user_account,
          fold: true,
          funct: 'ATTENDANCE',
        };
      });
      // 강사 리스트 지정
      onChangeNavList(teacher_list);
    } else {
      CheckToken(refreshToken, token, onChangeToken, res);
    }
  }, [token, refreshToken]);

  useEffect(() => {
    getTeacher();
  }, [getTeacher]);

  useEffect(() => {
    getTeacher();
  }, [getTeacher]);

  // 강사를 클릭했을시 펼침와 접음을 지정한다
  const onTeacherClick = (id, name) => {
    // 클릭된 아이디를 통해 펼침을 지정해 준다 클린된 강사 이외에는 모두 접음으로 지정한다
    onChangeNavList(
      navList.map((data) => {
        return data.id === id ? { ...data, fold: false } : { ...data, fold: true };
      }),
    );

    onChangeClickedTeacherInfo({ id, name, funct: '' });
  };

  const teacher_list = navList.map((data) => {
    const unFoldStyle = {
      background: '#9162FF',
    };
    return (
      <div className="Schedule__TeacherWrap" key={data.id} style={data.fold ? null : unFoldStyle}>
        <span onClick={onTeacherClick.bind(this, data.id, data.name)} className="Schedule__TeacherName">
          {data.name + ' (' + data.account + ')'}
        </span>
        {clickedTeacherInfo && data.id === clickedTeacherInfo.id ? (
          <NavTeacherFunctions
            data={data}
            clickedFunct={clickedTeacherInfo.funct}
            onChangeClickedTeacherInfo={onChangeClickedTeacherInfo}
          />
        ) : null}
      </div>
    );
  });

  return <div className="Schedule__NavTeacher">{teacher_list}</div>;
}
