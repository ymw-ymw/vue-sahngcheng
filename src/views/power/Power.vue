<template>
	<div>
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>权限列表</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card>
			<el-table :data="RightList" border stripe style="width: 100%">
				<el-table-column type="index" label="#">
				</el-table-column>
				<el-table-column prop="authName" label="权限名称" width="180">
				</el-table-column>
				<el-table-column prop="path" label="路径" width="180">
				</el-table-column>
				<el-table-column prop="level" label="权限等级" width="180">
					<template slot-scope="scope">
						<el-tag  v-if="scope.row.level === '0'">等级一</el-tag>
						<el-tag type="success" v-else-if="scope.row.level === '1'">等级二</el-tag>
						<el-tag type="warning" v-else="scope.row.level === '2'">等级三</el-tag>
					</template>
				</el-table-column>				
			</el-table>
		</el-card>
	</div>	
</template>

<script>
	export default{
		name:'Power',
		data() {
			return {
				RightList:[]
			}
		},
		created() {
			this.getRightList()
		},
		methods:{
			getRightList() {
				this.$http.get('rights/list').then(res =>{
					console.log(res.data.data);
					this.RightList = res.data.data
				}).catch(err =>{
					console.log(err)
				})
			}
		}
	}
</script>

<style>
</style>
