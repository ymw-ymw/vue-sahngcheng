import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const Login = () => import("views/login/Login")
const Home = () => import("views/home/Home")
const Welcome = () => import('views/home/homeChildren/Welcome')
const User = () => import('views/user/User')
const Power = () => import('views/power/Power')
const Roles = () => import('views/power/Roles')
const CateGories = () => import('views/goodslist/CateGories')
const Goods = () => import('views/goodslist/Goods')
const GoodsAdd = () => import('views/goodslist/add') 
const GoodsUpdata = () => import('views/goodslist/Updata')
const Params =() => import('views/goodslist/Params')
const Orders = () =>import('views/orders/Orders')
const Reports = () => import('views/reports/Reports')

const routes = [{
	path: '/',
	redirect: '/login'
}, {
	path: '/login',
	component: Login
}, {
	path: '/home',
	component: Home,
	redirect: '/welcome',
	children: [{
		path: '/welcome',
		component: Welcome
	}, {
		path: '/users',
		component: User
	},{
				path: '/rights',
				component: Power
			},
			{
				path: '/roles',
				component: Roles
			}	,{
				path: '/categories',
				component: CateGories
			},{
				path: '/goods',
				component: Goods
			},
			{
				path: '/goods/add',
				component: GoodsAdd
			},
			{
				path: '/goods/updata',
				component: GoodsUpdata
			},{
				path: '/params',
				component: Params
			},{
				path: '/orders',
				component: Orders
			},{
				path: '/reports',
				component: Reports
			}]
}]

const router = new VueRouter({
	routes
})

// 路由导航首位,
router.beforeEach((to, from, next) => {
	if (to.path === '/login') return next();
	const token = window.sessionStorage.getItem('token')
	if (!token) return next('/login')
	next();
})


export default router
