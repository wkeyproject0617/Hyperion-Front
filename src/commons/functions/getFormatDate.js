/*
 * 날짜포맷 yyyy-MM-dd 변환
 */

const getFormatDate = (date) => {
    
    var year = date.getFullYear();
    var month = 1 + date.getMonth();
    month = month >= 10 ? month : '0' + month;
    var day = date.getDate();
    day = day >= 10 ? day : '0' + day;
    return year + '-' + month + '-' + day;
};

    export default getFormatDate;