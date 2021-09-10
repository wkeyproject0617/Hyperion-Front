import courseDetailData from '../../../commons/test/teacherManage/attendance/courseDetail';

const onAttdDetailClick = (id) => {
  // const res = axios.get(`/adminApi/signUp/student/attendance/${data.id}`);
  const res = courseDetailData;
  if (res.description === '조회성공') {
    return {
      show: true,
      data: res.data,
    };
  } else {
    // handling error
  }
};
export default onAttdDetailClick;
