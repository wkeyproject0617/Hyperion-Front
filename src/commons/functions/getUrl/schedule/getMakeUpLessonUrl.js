const getMakeUpLessonUrl = (endDate, startDate, subjectId, userId) => {
  return `/adminApi/signUp/students/attendanceAndConsult/lectureAndDate/?endDate=${endDate}&startDate=${startDate}&subjectId=${subjectId}&user_id=${userId}`;
};

export default getMakeUpLessonUrl;
