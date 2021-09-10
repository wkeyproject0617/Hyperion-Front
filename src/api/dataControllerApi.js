import axios from 'axios';

const BASE_URL = 'http://mindpass.synology.me';

const Api = {
  getData(url, header) {
    return axios.get(BASE_URL + url, header);
  },

  postData(url, datas, headers) {
    return axios.post(BASE_URL + url, datas, headers);
  },

  patchData(url, datas, headers) {
    return axios.patch(BASE_URL + url, datas, headers);
  },

  deleteData(url, header) {
    return axios.delete(BASE_URL + url, header);
  },
};
export default Api;
