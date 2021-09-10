import axios from 'axios';

const BaseUrl = "http://localhost:8080";

const Api = {
  postLogin(user){
    return axios.post(BaseUrl + '/session/login', user);
  }
}

export default Api