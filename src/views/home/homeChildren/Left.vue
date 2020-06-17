<template>
	<el-row>
		<div class="topclass" @click="topclick">
			<span>|||</span>
		</div>
		<el-col :span="12">
			<el-menu :collapse='topstatus' :default-active="activepaths" :collapse-transition="false" router background-color="#545c64"
			 text-color="#fff" active-text-color="#409Eff" unique-opened>
				<el-submenu :index="item.id + '' " v-for="item in menus" :key="item.id">
					<template slot="title">
						<i :class="icons[item.id]"></i>
						<span>{{item.authName}}</span>
					</template>
					<el-menu-item :index="'/' + itemlist.path" @click="activepath('/' + itemlist.path)" v-for="itemlist in item.children"
					 :key="itemlist.id">
						<i class="el-icon-menu"></i>
						<span slot="title">{{itemlist.authName}}</span>
					</el-menu-item>
				</el-submenu>
			</el-menu>
		</el-col>
	</el-row>
</template>

<script>
	import {
		GetLeft
	} from 'network/home/Leftrequest.js'
	export default {
		name: 'Left',
		data() {
			return {
				menus: [],
				icons: {
					'125': 'iconfont icon-user',
					'103': 'iconfont icon-tijikongjian',
					'101': 'iconfont icon-shangpin',
					'102': 'iconfont icon-danju',
					'145': 'iconfont icon-baobiao'
				},
				topstatus: true,
				activepaths: ''
			}
		},
		created() {
			this.GetLeftList()
			this.activepaths = window.sessionStorage.getItem('activepath')
		},
		methods: {
			// 判定是否显示左侧菜单，
			topclick() {
				this.$emit('isleftzhnakai', this.topstatus)
				this.topstatus = !this.topstatus;
			},
			
			
			// 动态的 决定 那一项高亮显示
			activepath(activepath) {
				console.log(activepath)
				window.sessionStorage.setItem('activepath', activepath)
				this.activepaths = activepath
			},
			
			
			//封装的请求函数
			GetLeftList() {			
				this.$http.get("menus").then(res => {
					this.menus.push(...res.data.data)
				}).catch(err => {
					console.log(err)
				})
			}
		}
	}
</script>

<style>
	.topclass {
		background-color: #4A5064;
		text-align: center;
		color: #fff;
		cursor: pointer
	}

	.el-menu {
		width: 200px;
		border-right: none;
	}

	.iconfont {
		margin-right: 5px;
	}
</style>
