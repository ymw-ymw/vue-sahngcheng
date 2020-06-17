import Vue from 'vue'
import axios from 'axios'



const instance1 = axios.create({
			baseURL: "http://127.0.0.1:8888/api/private/v1/"  ,
			timeout: 5000
		});
instance1.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = instance1




export default function request(config) {
	const instance = axios.create({
			baseURL: "http://127.0.0.1:8888/api/private/v1/"  ,
			timeout: 5000
		});
		// 2.axios的拦截器
		// 2.1.请求拦截的作用
		instance.interceptors.request.use(config => {
			config.headers.Authorization = window.sessionStorage.getItem('token')
		  return config
		}, err => {
		  // console.log(err);
		})
		
		// 2.2.响应拦截
		instance.interceptors.response.use(res => {
		  return res.data
		}, err => {
		  console.log(err);
		})
		
		// 3.发送真正的网络请求
		return instance(config)
}

