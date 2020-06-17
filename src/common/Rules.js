var checkEmail = (rule, value, cb) => {
 	// 验证邮箱的正则表达式
 	const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
 	if (regEmail.test(value)) {
 		// 合法的邮箱
 		return cb()
 	}
 	cb(new Error('请输入合法的邮箱'))
 }
 // 验证手机号的规则
 var checkMobile = (rule, value, cb) => {
 	// 验证手机号的正则表达式
 	const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

 	if (regMobile.test(value)) {
 		return cb()
 	}
 	cb(new Error('请输入合法的手机号'))
 }

 export const addFormRules = {
 	username: [{
 			required: true,
 			message: '请输入用户名',
 			trigger: 'blur'
 		},
 		{
 			min: 3,
 			max: 10,
 			message: '用户名的长度在3~10个字符之间',
 			trigger: 'blur'
 		}
 	],
 	password: [{
 			required: true,
 			message: '请输入密码',
 			trigger: 'blur'
 		},
 		{
 			min: 6,
 			max: 15,
 			message: '用户名的长度在6~15个字符之间',
 			trigger: 'blur'
 		}
 	],
 	email: [{
 			required: true,
 			message: '请输入邮箱',
 			trigger: 'blur'
 		},
 		{
 			validator: checkEmail,
 			trigger: 'blur'
 		}
 	],
 	mobile: [{
 			required: true,
 			message: '请输入手机号',
 			trigger: 'blur'
 		},
 		{
 			validator: checkMobile,
 			trigger: 'blur'
 		}
 	]
 }
 export const UpdataRules = {
 	username: [{
 			required: true,
 			message: '请输入用户名',
 			trigger: 'blur'
 		},
 		{
 			min: 3,
 			max: 10,
 			message: '用户名的长度在3~10个字符之间',
 			trigger: 'blur'
 		}
 	],
 	email: [{
 			required: true,
 			message: '请输入邮箱',
 			trigger: 'blur'
 		},
 		{
 			validator: checkEmail,
 			trigger: 'blur'
 		}
 	],
 	mobile: [{
 			required: true,
 			message: '请输入手机号',
 			trigger: 'blur'
 		},
 		{
 			validator: checkMobile,
 			trigger: 'blur'
 		}
 	]
 }
 export const RolesFormRules = {
 	username: [{
 			required: true,
 			message: '请输入用户名',
 			trigger: 'blur'
 		},
 		{
 			min: 3,
 			max: 10,
 			message: '用户名的长度在3~10个字符之间',
 			trigger: 'blur'
 		}
 	],
 }
