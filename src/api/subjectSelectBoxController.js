import axios from 'axios';

const BaseUrl = "http://localhost:8080";
let header = '';

const Api = {

  getSubjectsCategories(){
    header = TokenUpdate();
    return axios.get(BaseUrl + '/api/selectBox/subjectCategories', header);
  },

  getSubjectsTitles(data){
    header = TokenUpdate();
    return axios.get(BaseUrl + '/api/selectBox/subjectTitles?category=' + data, header);
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