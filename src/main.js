import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'

const instance1 = axios.create({
	baseURL: "http://127.0.0.1:8888/api/private/v1/",
	timeout: 5000
})

// 请求拦截
		instance1.interceptors.request.use(config => {
			config.headers.Authorization = window.sessionStorage.getItem('token')
		  return config
		}, err => {
		   console.log(err);
		})
// 响应拦截
		instance1.interceptors.response.use(res => {
		  return res.data
		}, err => {
		  console.log(err);
		})

Vue.prototype.$http = instance1



import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
	router,
  render: h => h(App),
}).$mount('#app')
