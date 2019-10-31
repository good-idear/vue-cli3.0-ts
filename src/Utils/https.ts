import axios from "axios";

// 创建axios实例
let service: any = {};
if(process.env.NODE_ENV === 'development'){
    service = axios.create({
        baseURL:'http://localhost:3000',  // 如果上线改成相应的服务器地址 + 端口
        timeout:1000*60,
        withCredentials:true    // 允许携带cookie
    })
}else{
    service = axios.create({
        baseURL:'http://localhost:3000',
        timeout:1000*60,
        withCredentials:true    // 允许携带cookie
    })
}
console.log("process.env.BASE_URL", process.env.BASE_URL);
//request拦截器 axios的一些配置
service.interceptors.request.use(
  (config: any) => {
    return config;
  },
  (error: any) => {
    // Do something with request error
    console.error("error:", error); // for debug
    Promise.reject(error);
  }
);

// respone拦截器 axios的一些配置
service.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error: any) => {
    console.error("error:" + error); // for debug
    return Promise.reject(error);
  }
);

export default service;
