<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>参数列表</el-breadcrumb-item>
		</el-breadcrumb>


		<!-- 卡片视图区域 -->
		<el-card>
			<!-- 警告区域 -->
			<el-alert show-icon title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false"></el-alert>

			<!-- 选择商品分类区域 -->
			<el-row class="cat_opt">
				<el-col>
					<span>选择商品分类：</span>
					<!-- 选择商品分类的级联选择框 -->
					<el-cascader expand-trigger="hover" :options="CartList" :props="cateProps" v-model="selectedCateKeys" @change="handleChange">
					</el-cascader>
				</el-col>
			</el-row>

			<el-tabs v-model="activeName" @tab-click="handleTabClick">
				<!-- 添加动态参数的面板 -->
				<el-tab-pane label="动态参数" name="many">
					<!-- 添加参数的按钮 -->
					<el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加参数</el-button>
					<!-- 动态参数表格 -->
					<el-table :data="manyTableData" border stripe>
						<!-- 展开行 -->
						<el-table-column type="expand">
							<template slot-scope="scope">
								<el-tag closable v-for="(item,i) in scope.row.attr_vals" :key="i" @close="deleatInput(i,scope.row)">{{item}}</el-tag>
								<!-- 输入的文本框 -->
								<el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput"
								 size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
								</el-input>
								<!-- 添加按钮 -->
								<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
							</template>
						</el-table-column>
						<!-- 索引列 -->
						<el-table-column type="index"></el-table-column>
						<el-table-column label="参数名称" prop="attr_name"></el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
								<el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
				
				
				
				<!-- 添加静态属性的面板 -->
				<el-tab-pane label="静态属性" name="only">
					<!-- 添加属性的按钮 -->
					<el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加属性</el-button>
					<!-- 静态属性表格 -->
					<el-table :data="onlyTableData" border stripe>
						<!-- 展开行 -->
						<el-table-column type="expand">
							<template slot-scope="scope">
								<el-tag closable v-for="(item,i) 
								in scope.row.attr_vals" :key="i" @close="deleatInput(i,scope.row)">{{item}}</el-tag>
								<!-- 输入的文本框 -->
								<el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput"
								 size="small" @click="isshowinputVisible" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
								</el-input>
								<!-- 添加按钮 -->
								<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
							</template>
						</el-table-column>
						<!-- 索引列 -->
						<el-table-column type="index"></el-table-column>
						<el-table-column label="属性名称" prop="attr_name"></el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
								<el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
			</el-tabs>
		</el-card>



		<!-- 添加参数的对话框 -->
		<el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
			<!-- 添加参数的对话框 -->
			<el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
				<el-form-item :label="titleText" prop="attr_name">
					<el-input v-model="addForm.attr_name"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addParams">确 定</el-button>
			</span>
		</el-dialog>


		<!-- 修改参数的对话框 -->
		<el-dialog :title="'修改' + titleText" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
			<!-- 添加参数的对话框 -->
			<el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
				<el-form-item :label="titleText" prop="attr_name">
					<el-input v-model="editForm.attr_name"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editParams">确 定</el-button>
			</span>
		</el-dialog>


	</div>
</template>

<script>
	export default {
		name: 'Params',
		data() {
			return {
				//商品分类列表
				CartList: [],
				//级联选择框配置
				cateProps: {
					value: 'cat_id',
					label: 'cat_name',
					children: 'children'
				},
				//级联选择框选中的数据
				selectedCateKeys: [],
				//被激活的标签名称
				activeName: 'many',
				//是否禁用选择属性卡
				addDialogVisible: false,
				//动态参数
				manyTableData: [],
				//静态属性
				onlyTableData: [],
				//isshow 添加动态参数或者属性面板
				addDialogVisible: false,
				// 添加参数的表单数据对象
				addForm: {
					attr_name: ''
				},
				// 添加表单的验证规则对象
				addFormRules: {
					attr_name: [{
						required: true,
						message: '请输入参数名称',
						trigger: 'blur'
					}]
				},
				//修改表单对象规则
				editFormRules: {
					attr_name: [{
						required: true,
						message: '请输入参数名称',
						trigger: 'blur'
					}]
				},
				// 修改的表单数据对象
				editForm: {},
				//修改的表格是否显示
				editDialogVisible: false
			}
		},
		computed: {
			isBtnDisabled() {
				if (this.selectedCateKeys.length !== 3) {
					return true
				}
				return false
			},
			cartID() {
				if (this.selectedCateKeys.length === 3) {
					return this.selectedCateKeys[2]
				}
				return null
			},
			titleText() {
				if (this.activeName === 'many') {
					return '动态参数'
				} else {
					return "静态参数"
				}
			}

		},
		created() {
			this.GetCartList()
		},

		methods: {

			/* 添加状态区域 */
			//添加小属性, 文本框失去焦点，或者按下
			handleInputConfirm(row) {
				if (row.inputValue.trim().length === 0) {
					row.inputValue = ''
					row.inputVisible = false
					return
				}
				//输入正确，进行后续处理
				row.attr_vals.push(row.inputValue.trim())
				row.inputValue = ''
				row.inputVisible = false
				//需要发起请求，保存数据
				this.saveAttr_valuse(row)
			},
			//isshow 文本框
			showInput(row) {
				row.inputVisible = true
				//让文本框自动或的焦点
				//.$nextTick 页面重新渲染后才会执行后面的代码
				this.$nextTick(_ => {
					this.$refs.saveTagInput.$refs.input.focus();
				});
			},
			//删除小标签
			deleatInput(id, row) {
				row.attr_vals.splice(id, 1)
				this.saveAttr_valuse(row)
			},

			//封装attr_values 保存数据库的请求
			saveAttr_valuse(row) {
				this.$http.put(`categories/${this.cartID}/attributes/${row.attr_id}`, {
					attr_name: row.attr_name,
					attr_sel: row.attr_sel,
					attr_vals: row.attr_vals.join(' ')
				}).then(res => {
					console.log(res)
					this.GetParamsCartList()
				}).catch(err => {
					console.log(err)
				})
			},







			/* 删除操作区域 */
			removeParams(attr_id) {
				this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(res => {
					return this.$http.delete(`categories/${this.cartID}/attributes/${attr_id}`)
				}).catch(err => {
					return
				}).then(res => {
					this.GetParamsCartList()
					return this.$message.error('删除成功！')
				})
			},


			/* 修改参数区域 */
			//清空表单
			editDialogClosed() {
				this.$refs.editFormRef.resetFields()
			},

			//修改按钮的点击事件
			showEditDialog(arrt_id) {
				this.editDialogVisible = true
				this.$http.get(`categories/${this.cartID}/attributes/${arrt_id}`, {
					params: {
						//当前查询参数的信息
						attr_sel: this.activeName
					}
				}).then(res => {
					this.editForm = res.data.data
					console.log(res)
				}).catch(err => {
					console.log(err)
				})
			},

			//修改的确定按钮
			editParams() {
				console.log(this.editForm.attr_id)
				console.log(this.editForm.attr_name)
				console.log(this.activeName)
				this.$refs.editFormRef.validate().then(res => {
					return this.$http.put(`categories/${this.cartID}/attributes/${this.editForm.attr_id}`, {
						attr_name: this.editForm.attr_name,
						attr_sel: this.activeName
					})
				}).then(res => {
					console.log(res)
					this.editDialogVisible = false
					this.GetParamsCartList()
				}).catch(err => {
					console.log(err)
				})
			},



			/* 添加参数或属性区域 */

			//tab 标签页被点击的事件
			handleTabClick() {
				this.GetParamsCartList()
			},

			//监听添加表格关闭事件
			addDialogClosed() {
				this.$refs.addFormRef.resetFields()
			},

			//点击按钮，添加参数
			addParams() {
				this.$refs.addFormRef.validate().then(res => {
					return this.$http.post(`categories/${this.cartID}/attributes`, {
						attr_name: this.addForm.attr_name,
						attr_sel: this.activeName
					})
				}).then(res => {
					console.log(res)
					this.addDialogVisible = false
				})
			},

			//监听选择框的变化触发
			handleChange() {
				if (this.selectedCateKeys.length !== 3) {
					this.selectedCateKeys = []
					this.manyTableData = []
					this.onlyTableData = []
					return
				}
				this.GetParamsCartList()
			},




			//封装的请求数据的函数
			GetParamsCartList() {
				if (this.selectedCateKeys.length !== 3) {
					this.selectedCateKeys = []
					return
				}
				//请求对应的数据
				this.$http.get(`categories/${this.cartID}/attributes`, {
					params: {
						sel: this.activeName
					}
				}).then(res => {
					res.data.data.forEach(item => {
						item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : [],
							item.inputVisible = false
						item.inputValue = ''
					})
					console.log(res.data.data)
					if (this.activeName === 'many') {
						this.manyTableData = res.data.data
					} else {
						this.onlyTableData = res.data.data
					}
				}).catch(err => {
					console.log(err)
				})
			},

			//页面创建第一次请求参数
			GetCartList() {
				this.$http.get('categories').then(res => {
					console.log(res.data.data)
					this.CartList = res.data.data
				}).catch(err => {
					console.log(err)
				})
			}
		}

	}
</script>

<style>
	.cat_opt {
		margin: 15px 0;
	}

	.el-tag {
		margin: 5px;
	}

	.input-new-tag {
		width: 120px;
	}
</style>
