import axios from 'axios';

const BaseUrl = "http://localhost:8080";
let header = '';

const Api = {
  getSubjects(page){
    header = TokenUpdate();
    return axios.get(BaseUrl + '/api/subjects?page=' + page, header);
  },

  getSubjectsOne(id){
    header = TokenUpdate();
    return axios.get(BaseUrl + '/api/subjects/' + id, header);
  },

  postSubjects(subject){
    header = TokenUpdate();
    return axios.post(BaseUrl + '/adminApi/subjects', subject, header);
  },

  deleteSubjects(id){
    header = TokenUpdate();
    return axios.delete(BaseUrl + '/adminApi/subjects/' + id, header);
  },

  patchSubjects(data){
    header = TokenUpdate();
    return axios.patch(BaseUrl + '/adminApi/subjects', data, header);
  },

  getDuplicatSubjects(category, level, title){
    header = TokenUpdate();
    
    //과목명 특수문자 인코딩
    const query = encodeURIComponent(title);

    const url = `/adminApi/subjects?category=${category}&level=${level}&title=${query}`;

    return axios.get(BaseUrl + url, header);
  },

  getSubjectCategories(category, page){
    header = TokenUpdate();
    return axios.get(BaseUrl + '/api/subjectCategories?category=' + category + '&page=' + page, header);
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