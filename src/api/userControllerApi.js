import axios from 'axios';

const BaseUrl = "http://localhost:8080";

const Api = {
  postUsers(user){
    return axios.post(BaseUrl + '/users', user);
  },

  getAccountChk(account){
    return axios.get(BaseUrl + '/users/accountChk/' + account);
  },

  getEmailChk(email){
    return axios.get(BaseUrl + '/users/emailChk/' + email);
  },

  postUserSearch(findId){
    return axios.post(BaseUrl + '/users/userSearch', findId);
  },

  postUserPasswordSearch(findPw){
    return axios.post(BaseUrl + '/users/passwordSearch', findPw);
  }
}

export default Api;