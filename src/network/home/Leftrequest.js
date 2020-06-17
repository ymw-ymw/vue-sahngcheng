import request from '../request.js'
export function GetLeft(username, password) {
	return request({
		url: 'menus'
	})
}


export function GetUserList(query, pagenum, pagesize) {
	return request({
		url: 'users',
		params: {
			query,
			pagenum,
			pagesize
		}
	})
}

//修改用户状态
export function PutUser(url) {
	return request({
		url: url
	})
}
