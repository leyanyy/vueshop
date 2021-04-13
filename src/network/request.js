import axios from "axios"
export function request(config) {
  const instance = axios.create({
    baseURL: "http://127.0.0.1:8888/api/private/v1/",
    timeout: 8000
  })


  instance.interceptors.request.use((config) => { //请求拦截
    // console.log(config);
    config.headers.Authorization = window.sessionStorage.getItem("token")
      //下一擦请求的时候可以加上token令牌
      // console.log(config);
    return config
  })


  return instance(config)
}