<template>
	<div>
		<!-- 面包屑导航区 -->
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>用户管理</el-breadcrumb-item>
			<el-breadcrumb-item>用户列表</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片区 -->
		<el-card>
			<el-row :gutter="20">
				<el-col :span='7'>
					<!-- 搜索框区域 -->
					<el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="GetUserLists">
						<el-button slot="append" icon="el-icon-search" @click="GetUserLists"></el-button>
					</el-input>
				</el-col>
					
				<el-col :span='4'>
					<el-button type="primary" @click="adduser = true">添加用户</el-button>
				</el-col>
			</el-row>

			<!-- 添加用户处理 自己写的模板 -->
			<add-user-from :adduser="adduser" @chengaddUser="chengaddUser"></add-user-from>

			<!-- 表格搜索区 -->
			<el-table :data="UserList" border stripe style="width: 100%">
				<el-table-column type="index" label="#">
				</el-table-column>
				<el-table-column prop="username" label="姓名" width="180">
				</el-table-column>
				<el-table-column prop="email" label="邮箱">
				</el-table-column>
				<el-table-column prop="mobile" label="电话">
				</el-table-column>
				<el-table-column prop="role_name" label="角色">
				</el-table-column>
				
				<!-- 状态区域 -->
				<el-table-column label="状态">
					<template slot-scope="scope">
						<el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)" active-color="#13ce66"
						 inactive-color="#ff4949">
						</el-switch>
					</template>
				</el-table-column>
					<!-- 操作区域 -->				
				<el-table-column prop="role_name" label="操作">
					<template slot-scope="scope">
						<el-button type="primary" content="修改用户" icon="el-icon-edit" size="mini" @click="showupdate(scope.row.id)"></el-button>
						<el-button type="danger" content="删除用户" icon="el-icon-delete" size="mini" @click="showdeleteUser(scope.row.id)"></el-button>
						<el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false" @close="guanbi">
							<el-button type="warning" icon="el-icon-setting" size="mini" @click="isshowaddUserinfo(scope.row)"></el-button>
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>
			
			<!-- 修改用户操作 -->
				<el-dialog title="修改用户" :visible.sync="isupdata" @close="adduserclear">
					<el-form :model="update" :rules="UpdataRules" ref="UpdataRef" label-width="70px">
					  <el-form-item label="用户名">
					    <el-input v-model="update.username" disabled></el-input>
					  </el-form-item>
						<el-form-item label="邮箱" prop="email">
						  <el-input v-model="update.email"></el-input>
						</el-form-item>
						<el-form-item label="手机" prop="mobile">
						  <el-input v-model="update.mobile"></el-input>
						</el-form-item>
					</el-form>
					<el-button @click="isupdata = false">取 消</el-button>
					<el-button type="primary" @click="UpdataInfo">确 定</el-button>
				</el-dialog>
			
			<!-- 分配角色区域 -->
			<el-dialog
			  title="提示"
			  :visible.sync="isaddUserinfo"
			  width="50%">
			  <div>
					<p>当前的用户： {{userInfos.username}}</p>
					<p>当前的角色： {{userInfos.role_name}}</p>					
					<p>
						 <el-select v-model="showRoles"  placeholder="请选择权限">
					    <el-option
					      v-for="item in showRolesList"
					      :key="item.id"
					      :label="item.roleName"
					      :value="item.id">
					    </el-option>
					 </el-select></p>				
				</div>
			  <span slot="footer" class="dialog-footer">
			    <el-button @click="isaddUserinfo = false">取 消</el-button>
			    <el-button type="primary" @click="ServeRolesInfo">确 定</el-button>
			  </span>
			</el-dialog>
			
			
					
			<!-- 分页区域 -->
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
			 :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</el-card>

	</div>
</template>

<script>
	import AddUserFrom from './userchildren/AddFrom.vue'
	import { UpdataRules } from 'common/Rules.js'
	export default {
		name: 'User',
		data() {
			return {
				queryInfo: {
					query: '',
					pagenum: 1,
					pagesize: 2,
				},
				total: null,
				UserList: [],
				adduser: false,
				update: {},
				isupdata: false,
							
				/*分配用户角色权限的变量 */
				isaddUserinfo:false,
				//当前被分配角色的信息
				userInfos:[],
				//展示获取的数据
				showRolesList:[],
				//存储获得分配的角色
				showRoles:'',
				addForm: {
					username: '',
					password: '',
					email: '',
					mobile: ''
				},
				UpdataRules: UpdataRules
			}
		},
		components: {
			AddUserFrom,			
		},
		//页面创建，第一次请求数据
		created() {
			this.GetUserLists()
		},
		methods: {
			
			//监听添加用户的操作
			chengaddUser() {
				this.adduser = false
				this.GetUserLists()
			},
			
			
			/* 分页区域函数方法 */
			handleSizeChange(size) {
				//监听显示数据改变
				this.queryInfo.pagesize = size;
				this.GetUserLists()
			},
			handleCurrentChange(page) {
				//监听页码改变
				this.queryInfo.pagenum = page;
				this.GetUserLists()
			},
			
			
			/* 用户更新的方法 */			
			showupdate(id) {
				//监听修改用户的操作				
				this.isupdata = true;
				this.$http.get('users/' + id).then(res =>{
					this.update = res.data.data					
				}).catch(err =>{
					console.log("更改用户信息失败")
				})
			},		
			//向服务器发送更改请求
			UpdataInfo(){
				this.$refs.UpdataRef.validate().then(res => {
					return this.$http.put('users/' + this.update.id,{ email:this.update.email, mobile:this.update.mobile})
				}).then(res => {						
					console.log(res)
					this.GetUserLists()
					this.isupdata = false;
				}).catch(err =>{
					console.log(err)
				})
			},
			//监听更改的关闭
			adduserclear(){				
				this.$refs.UpdataRef.resetFields()
			},
			
			
						
			/* 用户删除操作区域  */		 			
			 showdeleteUser(id) {
					//监听用户删除的操作
					this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
					  confirmButtonText: '确定',
					  cancelButtonText: '取消',
					  type: 'warning',					
					}).then(res =>{
						return this.$http.delete( `roles/${id}` );			
					}).then(res =>{							
						this.GetUserLists()
						this.$message.error('删除成功！')
					}).catch(err =>{
						console.log(err)
					})
			},
			
									 
			/*分配用户角色权限的方法  */			
			ServeRolesInfo(){
				//像服务器发送请求，保存用户分配
				if(!this.showRoles){
					return console.log('请选择要分配的角色')
				}			
				this.$http.put(`users/${this.userInfos.id}/role`,{rid: this.showRoles}).then(res =>{
				this.isaddUserinfo = false
				this.GetUserLists()
				}).catch(err =>{
					console.log(err)
				})
			},		
			isshowaddUserinfo(userInfo) {
				//监听用户权限分配对话框的显示
				this.userInfos = userInfo
				this.isaddUserinfo = true
				this.$http.get('roles').then(res =>{
					this.showRolesList = res.data.data
				}).catch(err =>{
					console.log(err)
				})
			},
			//监听用户关闭，清空数据
			guanbi() {
				this.userInfos = ''				
				this.showRoles =''
			},
			
			
			
			/* 发送请求数据区域 */
			GetUserLists() {
				this.$http.get('users', {
					params: this.queryInfo
				}).then(res => {
					console.log(res)
					this.total = res.data.data.total;
					this.UserList = res.data.data.users;
				}).catch(err => {
					console.log(err)
					console.log('获取用户列表失败')
				})
			},
			
			
			
			userStateChanged(info) {
				//用户状态修改请求
				this.$http.put(`users/${info.id}/state/${info.mg_state}`).catch(err => {
					info.mg_state = !info.mg_state
					console.log('用户修改失败')
				})
			}
		}
	}
</script>

<style>
	.el-table {
		margin-top: 10px;
	}

	.el-pagination {
		margin-top: 15px;
	}
</style>
