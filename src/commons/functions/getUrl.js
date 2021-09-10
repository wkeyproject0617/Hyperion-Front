const getUrl = {
  // (출석관리) 정기 수업
  getCourseUrl: (endDate, startDate, subjectId, userId) => {
    return `/adminApi/signUp/students/LecturendLocalDate/?endDate=${endDate}&startDate=${startDate}&subjectId=${subjectId}&user_id=${userId}`;
  },
  // (출석관리) 보강 수업
  getMakeUpLessonUrl: (endDate, startDate, subjectId, userId) => {
    return `/adminApi/signUp/students/attendanceAndConsult/lectureAndDate/?endDate=${endDate}&startDate=${startDate}&subjectId=${subjectId}&user_id=${userId}`;
  },
  // 보강관리 날개 부분
  getMakeUpLessonCouncelUrl: (endDate, startDate, subjectId, userId) => {
    return `/adminApi/signUp/student/consult/lectureAndDate/?endDate=${endDate}&startDate=${startDate}&subjectId=${subjectId}&user_id=${userId}`;
  },
  // 상담관리 날개 부분
  getCouncelUrl: (endDate, startDate, subjectId, userId) => {
    return ``;
  },
};

export default getUrl;