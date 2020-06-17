<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
		  <el-breadcrumb-item>商品列表</el-breadcrumb-item>
		</el-breadcrumb>
		
		<!-- 卡片视图区域 -->
		<el-card>
		  <el-row :gutter="20">
		    <el-col :span="8">
		      <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
		        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
		      </el-input>
		    </el-col>
		    <el-col :span="4">
		      <el-button type="primary" @click="goAddpage">添加商品</el-button>
		    </el-col>
		  </el-row>
		
		  <!-- table表格区域 -->
		  <el-table :data="goodslist" border stripe>
		    <el-table-column type="index"></el-table-column>
		    <el-table-column label="商品名称" prop="goods_name"></el-table-column>
		    <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
		    <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
		    <el-table-column label="创建时间" prop="add_time" width="140px">
		      <template slot-scope="scope">
		        {{scope.row.add_time | dateFormat}}
		      </template>
		    </el-table-column>
		    <el-table-column label="操作" width="130px">
		      <template slot-scope="scope">
		        <el-button type="primary" icon="el-icon-edit" size="mini" @click="goUpdatapage(scope.row.goods_id)"></el-button>
		        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.goods_id)"></el-button>
		      </template>
		    </el-table-column>
		  </el-table>
		
		  <!-- 分页区域 -->
		  <el-pagination @size-change="handleSizeChange" 
			@current-change="handleCurrentChange" 
			:current-page="queryInfo.pagenum" 
			:page-sizes="[5, 10, 15, 20]" 
			:page-size="queryInfo.pagesize" 
			layout="total, sizes, prev, pager, next, jumper" 
			:total="total" background>
		  </el-pagination>
		</el-card>
		
	</div>
</template>

<script>
	export default{
		name: 'Goods',
		data(){
			return {
				queryInfo: {
				  query: '',
				  pagenum: 1,
				  pagesize: 10
				},
				goodslist:[],
				total: 0
			}
		},
		

		//创建页面第一次请求数据
		created() {
			this.getGoodsList()
		},
		
		
		
		methods:{
			
			//跳转到指定路由页面
			goAddpage(){
				this.$router.push('/goods/add')
			},
			//跳转到更新路由
			goUpdatapage(id){
				this.$router.push({path:'./goods/updata', query:{id:id}})
			},
			
			
			
			
			//删除商品
			removeById(id){
				this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  type: 'warning'
				}).then(res =>{
					console.log(id)
					return this.$http.delete(`goods/${id}`)	
				}).then(res =>{			
					this.getGoodsList()
					return this.$message.error('删除成功！')
				})
			},
			
			
			
			handleSizeChange(newSize) {
			  this.queryInfo.pagesize = newSize
			  this.getGoodsList()
			},
			handleCurrentChange(newPage) {
			  this.queryInfo.pagenum = newPage
			  this.getGoodsList()
			},
			
			//数据请求的封装
			getGoodsList(){
				this.$http.get('goods',{params: this.queryInfo}).then(res =>{
					console.log(res.data.data.goods)
					this.goodslist = res.data.data.goods
					this.total = res.data.data.total
				}).catch(err =>{
					console.log(err)
				})
			}
		}
	}
</script>

<style>
	.el-card{
		margin-top: 10px;
	}
</style>
