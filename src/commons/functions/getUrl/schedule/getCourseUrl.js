const getCourseUrl = (endDate, startDate, subjectId, userId) => {
  return `/adminApi/signUp/students/LectureAndLocalDate/?endDate=${endDate}&startDate=${startDate}&subjectId=${subjectId}&user_id=${userId}`;
};

export default getCourseUrl;
