<template>
	<el-dialog title="添加用户" :visible.sync="adduser" width="30%" @close="adduserclear">
		<el-form :model="addForm" :rules="addFormRules" ref="addFormref">
			<el-form-item label="用户名" prop="username">
				<el-input v-model="addForm.username"></el-input>
			</el-form-item>
			<el-form-item label="密码" prop="password">
				<el-input v-model="addForm.password"></el-input>
			</el-form-item>
			<el-form-item label="邮箱" prop="email">
				<el-input v-model="addForm.email"></el-input>
			</el-form-item>
			<el-form-item label="手机" prop="mobile">
				<el-input v-model="addForm.mobile"></el-input>
			</el-form-item>
		</el-form>
		<span slot="footer">
			<el-button @click="addusers">取 消</el-button>
			<el-button type="primary" @click="addnewuser">确 定</el-button>
		</span>
	</el-dialog>
</template>

<script>
	import {addFormRules } from 'common/Rules.js'
	export default {
		name: "AddFrom",
		data() {
	
			return {
				addForm: {
					username: '',
					password: '',
					email: '',
					mobile: ''
				},
				addFormRules: addFormRules
			}
		},
		props: {
			adduser: {
				type: Boolean,
				default () {
					return []
				}
			}
		},
		
		
	
		methods: {
			//发送事件，是否显示对话框
			addusers() {
				this.$emit('chengaddUser')
			},
			
			//关闭表单，清除表单
			adduserclear() {
				this.$emit('chengaddUser')
				this.$refs.addFormref.resetFields()
			},
			
			
			//添加新的用户，发送请求
			addnewuser() {
				this.$refs.addFormref.validate().then(res => {
					return this.$http.post('users', this.addForm)
				}).then(res => {
					
					this.addusers()
					return this.$message.error('添加成功！')
				})

			}
		}
	}
</script>

<style>

</style>
