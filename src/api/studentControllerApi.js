import axios from 'axios';

const BaseUrl = "http://localhost:8080";
let header = '';

const Api = {
  getStudents(page){
    header = TokenUpdate();

    return axios.get(BaseUrl + '/api/students?page=' + page, header);
  },

  getStudentCategories(category, page){
    header = TokenUpdate();

    return axios.get(BaseUrl + '/api/students/category?subjectCategory=' + category + '&page=' + page, header);
  }

}

function TokenUpdate(){
  let token = window.localStorage.getItem("accessToken");
  let header = {
    Authorization: `Bearer ${token}`
  }
  
  return header;
}

export default Api;