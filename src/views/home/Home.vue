<template>
		<el-container>
			  <el-header>
					<div class="el-header-nav">
						<img src="~assets/img/heima.png" />
						<span>电商后台管理系统</span>
					</div>
					<exit></exit>
				</el-header>
				<!-- 左侧菜单栏 -->
			  <el-container>
			    <el-aside :width="topstatus ? '200px' :'64px' ">
						<left @isleftzhnakai="isleftzhnakai"></left>
					</el-aside>
			    <el-main>
						<router-view></router-view>
					</el-main>
			  </el-container>
			</el-container>
		</template>
<script>
	//引入定义封装的子组件
	//退出组件
	import Exit from './homeChildren/Exit.vue'
	//左侧布局组件
	import Left from './homeChildren/Left.vue'
	
	export default{
		name:'Home',
		data(){
			return {
				topstatus:''
			}
		},
		components:{
			Exit,
			Left
		},
		methods:{
			isleftzhnakai(data) {
				this.topstatus = data
			}
		}
	}
</script>

<style>
	.el-container{
		height: 100%;
	}
	.el-header{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 0;
		padding-right:0 ;
		font-size: 20px;
		background-color: #373b41;
	}
	.el-header-nav{
		display: flex;
		align-items: center;	
	}
	.el-header-nav span{
		margin-left: 10px;
		color: #fff;
	}
	.el-aside{
		
		background-color: #333744;
	}
	.el-main{
		background-color: #EAEDF1;
	}
</style>
