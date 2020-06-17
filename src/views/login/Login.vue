<template>
	<div class="login">
		<div class="login_box">
			<div class="nav_box">
				<img src="~assets/img/logo.png" />
			</div>

			<el-form ref='login' label-width="0px" class='centent_from' :model="form" :rules="loginrules">
				<!-- 用户名 -->
				<el-form-item prop='username'>
					<el-input v-model="form.username" prefix-icon='iconfont icon-yonghu'></el-input>
				</el-form-item>
				<!-- 密码 -->
				<el-form-item prop='password'>
					<el-input v-model="form.password" type='password' prefix-icon="iconfont icon-mima"></el-input>
				</el-form-item>
				<!-- 按钮 -->
				<el-form-item class='centent_button'>
					<el-button @click='onSubmit' type="primary">提交</el-button>
					<el-button type="info" @click='resetFields'>重置</el-button>
				</el-form-item>
			</el-form>

		</div>
	</div>
</template>

<script>
	export default {
		name: 'Login',
		data() {
			return {
				form: {
					username: '',
					password: '',
					
				},
				loginrules: {
					username: [{
							required: true,
							message: '请输入登录名称',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 5,
							message: '长度在3 到10 个字符之间',
							trigger: 'blur'
						}
					],
					password: [{
							required: true,
							message: '请输入登录密码',
							trigger: 'blur'
						},
						{
							min: 6,
							max: 15,
							message: '长度在6 到15 个字符之间',
							trigger: 'blur'
						}
					]
				}
			}
		},

		methods: {
			onSubmit() {
				//console.log(this.form)
				this.$refs.login.validate(async valid => {
					const res = await this.$http.post("login", this.form)
					if (res.meta.status !== 200) return this.$message({
						message: '请输入正确的用户名',
						type: 'warning'
					})
					window.sessionStorage.setItem('token', res.data.token)
					this.$router.push('/home')
					this.$message({
						message: '恭喜你，登陆成功',
						type: 'success'
					})
				})
			},
			
				resetFields() {
					this.$refs.login.resetFields()
				}
		}
	}
</script>

<style>
	.login {
		background-color: #2b4b6b;
		height: 100%;
	}

	.login_box {
		width: 450px;
		height: 450px;
		background-color: #fff;
		border-radius: 3px;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.nav_box {
		height: 130px;
		width: 130px;
		border-radius: 50%;
		border: 1px solid #eee;
		padding: 10px;
		box-shadow: 0 0 10px #ddd;
		position: fixed;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: #fff;

	}

	.nav_box img {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background-color: #999999;
	}


	.centent_from {
		position: absolute;
		width: 100%;
		top: 50%;
		padding: 10px;
		box-sizing: border-box;
	}

	.centent_button {
		position: fixed;
		left: 60%;
		top: 80%;
	}
</style>
