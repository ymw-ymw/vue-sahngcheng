<template>
	<div>
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>角色列表</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card>
			<el-button type="primary" @click="addsjshowRoles">添加角色</el-button>
			<el-table :data="RoulesList" border stripe style="width: 100%">
				<el-table-column type="expand">
					<template slot-scope="scope">
						<!-- 一级权限渲染 -->
						<el-row class="juzhong" :class="['borderbootom', i1 === 0 ? 'bordertop':'']" v-for="(item1, i1) in scope.row.children"
						 :key="item1.id">
							<el-col :span="5">
								<el-tag>{{item1.authName}}</el-tag>
								<i class="el-icon-caret-right"></i>
							</el-col>
							<el-col :span="19">
								<!-- 嵌套循环二级耳机权限 -->
								<el-row class="juzhong" :class="[i2 ===0 ? '':'bordertop']" v-for="(item2,i2) in item1.children" :key="item2.id">
									<el-col :span="6">
										<el-tag type="succes">{{item2.authName}}</el-tag>
										<i class="el-icon-caret-right"></i>
									</el-col>
									<!-- 嵌套循环三级权限渲染 -->
									<el-col :span="18">
										<el-tag @close="removeid(scope.row,item3.id)" closable type="succes" v-for="(item3,i3) in item2.children"
										 :key="item3.id">{{item3.authName}}</el-tag>
									</el-col>
								</el-row>
							</el-col>
						</el-row>
					</template>


				</el-table-column>
				<el-table-column type="index" label="#">
				</el-table-column>
				<el-table-column prop="roleName" label="角色名称" width="180">
				</el-table-column>
				<el-table-column prop="roleDesc" label="角色描述" width="180">
				</el-table-column>
				<el-table-column prop="level" label="操作" width="300">
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-edit" @click="updataRoles(scope.row.id)"></el-button>
						<el-button type="danger" icon="el-icon-delete" @click="showdeleteUser(scope.row.id)"></el-button>
						<el-button type="warning" icon="el-icon-setting" content="分配权限" @click="showRules(scope.row)" @close="closeshowid"></el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>

		<el-dialog title="分配权限" :visible.sync="isshowRule" width="30%">
			<el-tree :data="RuleList" ref="treeRef" :props="treeProps" show-checkbox node-key="id" default-expand-all
			 :default-checked-keys="defkey"></el-tree>
			<span slot="footer">
				<el-button @click="isshowRule =false">取 消</el-button>
				<el-button type="primary" @click="addRules">确 定</el-button>
			</span>
		</el-dialog>

		<!-- 编辑角色区域 -->
		<el-dialog title="添加用户" :visible.sync="isShowUpdateRoules" width="30%" @close="addRoulesClose">
			<el-form :model="updateRolesLict" :rules="updatFormRules" ref="UpdataRef">
				<el-form-item label="角色名称" prop="roleName">
					<el-input v-model="updateRolesLict.roleName" disabled></el-input>
				</el-form-item>
				<el-form-item label="角色描述" prop="roleDesc">
					<el-input v-model="updateRolesLict.roleDesc"></el-input>
				</el-form-item>

			</el-form>
			<span slot="footer">
				<el-button @click="isShowUpdateRoules = false">取 消</el-button>
				<el-button type="primary" @click="updateRoles">确 定</el-button>
			</span>
		</el-dialog>






		<!-- 添加角色区域 -->
		<el-dialog title="添加用户" :visible.sync="idShowAddRoules" width="30%" @close="addRoulesClose">
			<el-form :model="addRoles" :rules="addRolesFormRules" ref="adddataRef">
				<el-form-item label="用户名" prop="roleName">
					<el-input v-model="addRoles.roleName"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="roleDesc">
					<el-input v-model="addRoles.roleDesc"></el-input>
				</el-form-item>

			</el-form>
			<span slot="footer">
				<el-button @click="idShowAddRoules = false">取 消</el-button>
				<el-button type="primary" @click="addshowRoles">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import {
		RolesFormRules
	} from 'common/Rules.js'
	export default {
		name: "Roles",
		data() {
			return {
				RoulesList: [],
				isshowRule: false,
				RuleList: [],
				treeProps: {
					label: 'authName',
					children: 'children',
				},
				//默认选中的节点的id值
				defkey: [],
				//被选中的iD
				RolesID: '',
				idShowAddRoules: false,
				addRolesFormRules: RolesFormRules,
				addRoles: {
					roleName: '',
					roleDesc: ''
				},
				isShowUpdateRoules: false,
				updateRolesLict: {},
				updatFormRules: RolesFormRules
			}
		},
		created() {
			this.getRoulesList()
		},
		methods: {

			/* 添加用户区域 */
			addsjshowRoles() {
				this.idShowAddRoules = true
			},
			//向服务器发起请求数据
			addshowRoles() {
				this.$refs.adddataRef.validate().then(res => {
					return this.$http.post('roles', this.addRoles)
				}).then(res => {
					console.log(res)
					this.getRoulesList()
					this.idShowAddRoules = false
				}).catch(err => {
					console.log(err)
				})
			},
			//监听添加用户的关闭事件
			addRoules() {
				this.$refs.addFormref.resetFields()
			},


			/* 用户删除操作区域  */
			showdeleteUser(id) {
				//监听用户删除的操作
				this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(res => {
					console.log(id)
					return this.$http.delete(`roles/${id}`);
				}).then(res => {
					this.getRoulesList()
				}).catch(err => {
					console.log(err)
				})
			},


			/* 更新用户区域 */
			updataRoles(id) {
				this.isShowUpdateRoules = true
				this.$http.get(`roles/${id}`).then(res => {
					this.updateRolesLict = res.data.data
					console.log(res)
				}).catch(err => {
					console.log(res)
				})
			},
			//监听更新确定
			updateRoles(id) {
				this.$refs.UpdataRef.validate().then(res => {
					return this.$http.put('roles/' + this.updateRolesLict.roleId, {
						roleName: this.updateRolesLict.roleName,
						roleDesc: this.updateRolesLict.roleDesc
					})
				}).then(res => {
					this.getRoulesList()
					this.isShowUpdateRoules = false
				}).catch(err => {
					console.log(err)
				})
			},
			//监听用户关闭
			addRoulesClose() {
				this.$refs.UpdataRef.resetFields()

			},


			/* 权限分配 */
			//将用户新分配的权限发送服务器
			addRules() {
				const key = [
					...this.$refs.treeRef.getCheckedKeys(),
					...this.$refs.treeRef.getHalfCheckedKeys()
				]
				const keys = key.join(',')
				this.$http.post(`roles/${this.RolesID}/rights`, {
					rids: keys
				}).then(res => {
					this.getRoulesList()
					this.isshowRule = false
				}).catch(err => {
					console.log(err)
				})
			},


			//监听分配权限关闭
			closeshowid() {
				this.defkey = []
			},
			//通过递归，获取所有三级去哪先
			getleafkey(node, arr) {
				if (!node.children) {
					return arr.push(node.id)
				}
				node.children.forEach(item => {
					this.getleafkey(item, arr)
				})
			},
			//给用户分配权限
			showRules(row) {
				this.$http.get('rights/tree').then(res => {
					this.RolesID = row.id
					this.RuleList = res.data.data
					this.getleafkey(row, this.defkey)
					console.log(this.defkey)
				}).catch(err => {
					console.log(err)
				})
				//显示对话框
				this.isshowRule = true;
			},
			//移除权限
			removeid(roleId, rightId) {
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(res => {
					return this.$http.delete(`roles/${roleId.id}/rights/${rightId}`)
				}).catch(err => {
					return
				}).then(res => {
					console.log(roleId);
					console.log(res.data.data)
					roleId.children = res.data.data
					console.log('删除成功')
				})
			},
			//获取到用户的权限
			getRoulesList() {
				this.$http.get('roles').then(res => {
					console.log(res.data.data)
					this.RoulesList = res.data.data
				}).catch(err => {
					console.log(err)
				})
			}
		}
	}
</script>

<style>
	.el-tag {
		margin: 7px;
	}

	.juzhong {
		display: flex;
		align-items: center;
	}

	.bordertop {
		border-top: 1px solid #eee;
	}

	.borderbootom {
		border-bottom: 1px solid #eee;
	}
</style>
