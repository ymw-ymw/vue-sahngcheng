<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>添加商品</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片视图 -->
		<el-card>
			<!-- 提示区域 -->
			<el-alert title="添加商品信息" type="info" center show-icon :closable="false">
			</el-alert>
			<!-- 步骤条区域 -->
			<el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
				<el-step title="基本信息"></el-step>
				<el-step title="商品参数"></el-step>
				<el-step title="商品属性"></el-step>
				<el-step title="商品图片"></el-step>
				<el-step title="商品内容"></el-step>
				<el-step title="完成"></el-step>
			</el-steps>

			<!-- tab栏区域 -->

			<el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
				<el-tabs v-model="activeIndex" :tab-position="'left'" @tab-click="tabClicked">
					<el-tab-pane label="基本信息" name="0">
						<el-form-item label="商品名称" prop="goods_name">
							<el-input v-model="addForm.goods_name"></el-input>
						</el-form-item>
						<el-form-item label="商品价格" prop="goods_price">
							<el-input v-model="addForm.goods_price" type="number"></el-input>
						</el-form-item>
						<el-form-item label="商品重量" prop="goods_weight">
							<el-input v-model="addForm.goods_weight" type="number"></el-input>
						</el-form-item>
						<el-form-item label="商品数量" prop="goods_number">
							<el-input v-model="addForm.goods_number" type="number"></el-input>
						</el-form-item>
						
					</el-tab-pane>


					<el-tab-pane label="商品参数" name="1">
						<!-- 渲染表单的Item项 -->
						<el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
							<!-- 复选框组 -->
							<el-checkbox-group v-model="item.attr_vals">
								<el-checkbox :label="item" v-for="(item,i) in item.attr_vals" :key="i" border></el-checkbox>
							</el-checkbox-group>
						</el-form-item>
					</el-tab-pane>

					<el-tab-pane label="商品属性" name="2">
						<el-form-item :label="item.attr_name" v-for="(item,i) in onlyTableData" :key="i">
							<el-input v-model="item.attr_vals"></el-input>
						</el-form-item>
					</el-tab-pane>

					<el-tab-pane label="商品图片" name="3">
						<!-- action 表示图片要上传到的后台API地址 -->
						<el-upload :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :headers="headerObj"
						 :on-success="handleSuccess">
							<el-button size="small" type="primary">点击上传</el-button>
							<img :src="this.addForm."
						</el-upload>
					</el-tab-pane>

					<el-tab-pane label="商品内容" name="4">
						<!-- 富文本编辑器组件 -->
						<quill-editor v-model="addForm.goods_introduce"></quill-editor>
						<!-- 添加商品的按钮 -->
						<el-button type="primary" class="btnAdd" @click="upDataShop">确定更改</el-button>
					</el-tab-pane>
				</el-tabs>
			</el-form>

		</el-card>

		<!-- 图片预览 -->
		<el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
			<img :src="previewPath" alt="" class="previewImg">
		</el-dialog>
	</div>
</template>

<script>
	import _ from 'lodash'

	export default {
		name: 'add',
		data() {
			return {
				good_id: 0,
				activeIndex: '0',
				// 添加商品的表单数据对象
				addForm: {},
				goods_cat: [],
				aaa:["954", "977", "998"],
				addFormRules: {
					goods_name: [{
						required: true,
						message: '请输入商品名称',
						trigger: 'blur'
					}],
					goods_price: [{
						required: true,
						message: '请输入商品价格',
						trigger: 'blur'
					}],
					goods_weight: [{
						required: true,
						message: '请输入商品重量',
						trigger: 'blur'
					}],
					goods_number: [{
						required: true,
						message: '请输入商品数量',
						trigger: 'blur'
					}],
					goods_cat: [{
						required: true,
						message: '请选择商品分类',
						trigger: 'blur'
					}]
				},
				// 商品分类列表
				catelist: [],
				cateProps: {
					label: 'cat_name',
					value: 'cat_id',
					children: 'children'
				},
				// 动态参数列表数据
				manyTableData: [],
				// 静态属性列表数据
				onlyTableData: [],
				// 上传图片的URL地址
				uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
				// 图片上传组件的headers请求头对象
				headerObj: {
					Authorization: window.sessionStorage.getItem('token')
				},
				previewPath: '',
				previewVisible: false
			}
		},
		created() {
			this.getGoodsID()
			this.getGoodsList()
		},
		methods: {
			
			
			
			
			//获取商品id
			getGoodsID() {
				this.good_id = this.$route.query.id
				console.log(this.good_id)
			},
			//获取商品的所有信息
			getGoodsList() {
				this.$http.get(`goods/${this.good_id}`).then(res => {		
					console.log(res.data.data)
					res.data.data.attrs.forEach(item => {
					  item.attr_vals =
					    item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
					})
					this.addForm = res.data.data
				}).catch(err => {
					console.log(err)
				})
			},



		
			
			//商品参数的获取逻辑
			tabClicked(){
				if (this.activeIndex === '1') {
					this.$http.get(`categories/${this.good_id}/attributes`, {params: {sel: 'many'}}).then(res =>{
						console.log(res.data.data)								
						this.manyTableData = res.data.data
						res.data.data.forEach(item => {
						  item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
						})	
					}).catch(err =>{
						console.log(err)
					})
					}		
				else if (this.activeIndex === '2'){
					this.$http.get(`categories/${this.good_id}/attributes`, {params: {sel: 'only'}}).then(res =>{
						console.log(res.data.data)
						res.data.data.forEach(item => {
						  item.attr_vals =
						    item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
						})
						console.log(res.data.data)
						this.onlyTableData = res.data.data
					}).catch(err =>{
						console.log(err)
					})
				}
			},
			

			//确定更改商品的
			upDataShop(){
				console.log(this.addForm)
				// 执行添加的业务逻辑
				// lodash   cloneDeep(obj)
				const form = _.cloneDeep(this.addForm)
				// 处理动态参数
				this.manyTableData.forEach(item => {
				  const newInfo = {
				    attr_id: item.attr_id,
				    attr_value: item.attr_vals.join(',')
				  }
				  this.addForm.attrs.push(newInfo)
				})
				// 处理静态属性
				this.onlyTableData.forEach(item => {
				  const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
				  this.addForm.attrs.push(newInfo)
				})
				form.attrs = this.addForm.attrs
				this.$http.put(`goods/${this.good_id}`,{
					goods_name:this.addForm.goods_name,
					goods_price:this.addForm.goods_price,
					goods_number:this.addForm.goods_number,
					goods_weight:this.addForm.goods_weight,
					goods_introduce:this.addForm.goods_introduce,
					goods_cat:this.addForm.goods_cat,
					pics:this.addForm.pics,
					attrs:this.addForm.attrs
					}).then(res =>{
						this.$message.success('添加商品成功！')
						this.$router.push('/goods')
						console.log(res)
					}).catch(err =>{
						console.log(err)
					})
				
			},
		
		
			// 处理图片预览效果
			handlePreview(file) {
				console.log(file)
				this.previewPath = file.response.data.url
				this.previewVisible = true
			},
			// 处理移除图片的操作
			handleRemove(file) {
				// console.log(file)
				// 1. 获取将要删除的图片的临时路径
				const filePath = file.response.data.tmp_path
				// 2. 从 pics 数组中，找到这个图片对应的索引值
				const i = this.addForm.pics.findIndex(x => x.pic === filePath)
				// 3. 调用数组的 splice 方法，把图片信息对象，从 pics 数组中移除
				this.addForm.pics.splice(i, 1)
				console.log(this.addForm)
			},
			// 监听图片上传成功的事件
			handleSuccess(response) {
				console.log(response)
				// 1. 拼接得到一个图片信息对象
				const picInfo = {
					pic: response.data.tmp_path
				}
				// 2. 将图片信息对象，push 到pics数组中
				this.addForm.pics.push(picInfo)
				console.log(this.addForm)
			},			
		},		
	}
</script>

<style scoped>
	.el-checkbox {
		margin: 0 10px 0 0 !important;
	}

	.previewImg {
		width: 100%;
	}

	.btnAdd {
		margin-top: 15px;
	}
</style>
