<template>
	<div>
		<!-- 面包屑导航区 -->
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>商品分类</el-breadcrumb-item>
		</el-breadcrumb>
		
		<el-card>
			<el-row>
				<el-col>
					<el-button type="primary" @click="showaddCateDialog">添加分类</el-button>
				</el-col>
			</el-row>
			
			
			<!-- 表格区域 -->
			<!-- 表格 -->
			<tree-table class="treeTable" :data="cartlist" 
			:columns="columns" :selection-type="false" 
			:expand-type="false" show-index index-text="#" 
			border :show-row-hover="false">
			  <!-- 是否有效 -->
			  <template slot="isok" slot-scope="scope">
			    <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
			    <i class="el-icon-error" v-else style="color: red;"></i>
			  </template>
			  <!-- 排序 -->
			  <template slot="order" slot-scope="scope">
			    <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
			    <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
			    <el-tag type="warning" size="mini" v-else>三级</el-tag>
			  </template>
			  <!-- 操作 -->
			  <template slot="opt" slot-scope="scope">
			    <el-button type="primary" icon="el-icon-edit" size="mini" @click="updateCart(scope.row.cat_id)">编辑</el-button>
			    <el-button type="danger" icon="el-icon-delete" size="mini" @click="DeleteCartList(scope.row.cat_id)">删除</el-button>
			  </template>
			</tree-table>
			
			
			<!-- 分页区域 -->
			  <el-pagination @size-change="handleSizeChange"
				 @current-change="handleCurrentChange" 
				 :current-page="queryinfo.pagenum" 
				 :page-sizes="[3, 5, 10, 15]" 
				 :page-size="queryinfo.pagesize" 
				 layout="total, sizes, prev, pager, next, jumper" 
				 :total="total">
			  </el-pagination>
			</el-card>
		</el-card>
		
		
		<!-- 更新商品区域 -->
		<el-dialog title="添加分类" :visible.sync="isshowcategoriesList" width="50%" @close="categoriesListclose">
		 <!-- 添加分类的表单 -->
		 <el-form :model="updataList" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
		   <el-form-item label="分类名称：" prop="cat_name">
		     <el-input v-model="updataList.cat_name"></el-input>
		   </el-form-item>
		   
		 </el-form>		 
		  <span slot="footer">
		    <el-button @click="isshowcategoriesList = false">取 消</el-button>
		    <el-button type="primary" @click="updataCategoriesList" >确 定</el-button>
		  </span>
		</el-dialog>
		
		<!-- 添加商品区域 -->
		<el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed">
		 <!-- 添加分类的表单 -->
		 <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
		   <el-form-item label="分类名称：" prop="cat_name">
		     <el-input v-model="addCateForm.cat_name"></el-input>
		   </el-form-item>
		   <el-form-item label="父级分类：">
		     <!-- options 用来指定数据源 -->
		     <!-- props 用来指定配置对象 -->
		     <el-cascader expand-trigger="hover" 
				  :options="PartCateList" 
				  :props="cascaderProps"
					v-model="selectedKeys"
					@change="parentCateChanged"
				  clearable change-on-select>
		     </el-cascader>
		   </el-form-item>
		 </el-form>		 
		  <span slot="footer">
		    <el-button @click="addCateDialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="addCart" >确 定</el-button>
		  </span>
		</el-dialog>
		
	</div>
</template>

<script>
	import TreeTable from 'vue-table-with-tree-grid'
	export default{
		name: 'CateGories',
		data(){
			return {
				//所有商品的数据
				GoodList:[],
				//参数查询的参数
				queryinfo:{
					type:3,
					pagenum:1,
					pagesize:5
				},
				cartlist:[],
				total:0 ,
				// tree-table 指定数据
				columns: [
				  {
				    label: '分类名称',
				    prop: 'cat_name'
				  },
					{
					    label: '是否有效',
					    // 表示，将当前列定义为模板列
					    type: 'template',
					    // 表示当前这一列使用模板名称
					    template: 'isok'
					  },
					  {
					    label: '排序',
					    type: 'template',				
					    template: 'order'
					  },
					  {
					    label: '操作',	
					    type: 'template',					    
					    template: 'opt'
					  }					
				],
				//控制添加商品是否显示
				addCateDialogVisible:false,
				//添加分类表单数据
				addCateForm: {			  
				  // 父级分类的Id
				  cat_pid: 0,
					// 将要添加的分类的名称
					cat_name: '',
				  // 分类的等级，默认要添加的是1级分类
				  cat_level: 0
				},
				//表单分页验证规则			
				addCateFormRules: {
				  cat_name: [
				    { required: true, message: '请输入分类名称', trigger: 'blur' }
				  ]
				},
				//父级分类的所有数据
				PartCateList:[],
				//指定级联选择框
				cascaderProps:{
					value:'cat_id',
					label:'cat_name',
					children:'children'
				},
				//选中的父级id数据
				selectedKeys:[],
				deCart:'',
				updataList:[],
				isshowcategoriesList:false,
				cardId: 0
			}
		},
		components:{
			TreeTable
		},
		created() {
			this.GetGoodList()
		},
		methods:{
			
			//监听对话框关闭事件
			categoriesListclose(){
				
			},
			/* 编辑商品区域 */
			updateCart(id){
				console.log(id)
				this.$http.get(`categories/${id}`).then(res =>{
					console.log(res)
					this.cardId = id
					this.updataList = res.data.data
					this.isshowcategoriesList = true
				}).catch(err =>{
					console.log(err)
				})
				
			},
			//监听用户更新确定
			updataCategoriesList(){
				this.$http.put(`categories/${this.cardId}`,{cat_name:this.updataList.cat_name}).then(res =>{
					console.log(res)
					this.GetGoodList()
					this.isshowcategoriesList = false
				}).catch(err =>{
					console.log(err)
				})
			},
			
	
			/* 分页区域 */
			handleSizeChange(newsize){
				//监听最新的页码
				this.queryinfo.pagesize = newsize
				this.GetGoodList()
			},
			handleCurrentChange(newpage){
				//监听最新的页码改变
				this.queryinfo.pagenum = newpage
				this.GetGoodList()
			},
			
			/* 添加商品区域 */
			showaddCateDialog(){
				//现获取父级分类的对话框
				this.GetParentCateList()
				//是否显示添加商品对话框
				this.addCateDialogVisible = true
			},
			GetParentCateList(){
				//获取到前两级，分类的所有数据
				this.$http.get('categories',{params:{ type:2}}).then(res =>{
					this.PartCateList = res.data.data
				}).catch(err =>{
					console.log(err)
				})
			},
			parentCateChanged(){
				//选择项变化了，会触发
				if(this.selectedKeys.length >0){
					this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length -1]
					this.addCateForm.cat_level = this.selectedKeys.length								
					return
				}else{
					this.addCateForm.cat_pid = 0
					this.addCateForm.cat_level = 0
				}				
			},
			
			//监听添加页面的关闭，清楚页面中的数据
			addCateDialogClosed(){				
				this.$refs.addCateFormRef.resetFields()
				this.addCateForm.cat_pid = 0
				this.addCateForm.cat_level = 0
				this.selectedKeys = []
			},
			
			//添加分类
			addCart(){
				console.log(this.addCateForm)
				this.$refs.addCateFormRef.validate(valid =>{
					if(!valid) return
					console.log(this.addCateForm)
					this.$http.post('categories',this.addCateForm).then(res =>{					
						this.GetGoodList()
						this.addCateDialogVisible = false
					}).catch(err =>{
						console.log(err)
					})
				})
			},
			
			/* 删除商品区域 */
			DeleteCartList(id){
					//监听用户删除的操作
					console.log(id)
					this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
					  confirmButtonText: '确定',
					  cancelButtonText: '取消',
					  type: 'warning'
					}).then(res =>{
						return this.$http.delete('categories/' + id);			
					}).then(res =>{
						this.GetGoodList()
						return this.$message.error('删除成功！')
					})
			},
			
			// 请求商品数据 
			GetGoodList(){
				this.$http.get('categories',{params:this.queryinfo}).then(res =>{					
					this.total = res.data.data.total
					this.cartlist = res.data.data.result
					console.log(res.data.data)
				}).catch(err =>{
					console.log(err)
				})
			}
		}
		
	}
</script>

<style>
	.treeTable{
		margin-top: 15px;
	}
	.el-pagination{
		margin-top: 15px;
	}
	.el-form-item{
		width: 100%;
	}
</style>
