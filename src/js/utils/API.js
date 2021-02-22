import axios from 'axios';

export default axios.create({
  baseURL: 'https://radiant-temple-07706.herokuapp.com/',
  responseType: 'json',
});
