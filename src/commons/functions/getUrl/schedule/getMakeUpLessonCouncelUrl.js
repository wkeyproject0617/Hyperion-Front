const getMakeUpLessonCouncelUrl = (endDate, startDate, subjectId, userId) => {
  return `/adminApi/signUp/student/consult/init/?endDate=${endDate}&startDate=${startDate}&subjectId=${subjectId}&user_id=${userId}`;
};

export default getMakeUpLessonCouncelUrl;
