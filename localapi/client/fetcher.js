import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000";
// get이나 post 뒤에 8000이후의 URL만 들어가도 되게 됨

const fetcher = async (method, url, ...rest) => {
  const res = await axios[method](url, ...rest);
  // spread 연산자를 사용하는 이유는 아래에 메소드에 따라 필요한 인자의 개수가 다르므로
  // 그에 따라 전부 처리할 수 있게끔 한 것이다.
  return res.data;
};

// res.send로 보낸 데이터가 response 응답값 중에 data 프로퍼티에 있는 내용만
// 전달을 하는 것(res.data). MsgList로.

/*
get: axios.get(url[, config])
delete: axios.delete(url[, config])
post: axios.post(url, data[, config])
put: axios.put(url, data[, config])
*/
export default fetcher;
