<template>
	<div id="exit">
		 <el-button type="info" @click='exit'>退出登录</el-button>
	</div>
</template>

<script>
	export default{
		name:'Exit',
		methods:{
			exit() {
				window.sessionStorage.clear();
				this.$router.push('./login')
			}
		}
	}
</script>

<style>
	.exit{
		position: ;
	}
</style>
