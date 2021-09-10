const getConsultedUrl = (endDate, startDate, subjectId, userId) => {
  return `/adminApi/signUp/students/consult/consulted?endDate=${endDate}&startDate=${startDate}&subjectId=${subjectId}&user_id=${userId}`;
};

export default getConsultedUrl;
