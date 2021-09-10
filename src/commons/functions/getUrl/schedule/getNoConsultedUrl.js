const getNoConsultedUrl = (endDate, startDate, subjectId, userId) => {
  return `/adminApi/signUp/students/consult/noConsulted?endDate=${endDate}&startDate=${startDate}&subjectId=${subjectId}&user_id=${userId}`;
};

export default getNoConsultedUrl;
