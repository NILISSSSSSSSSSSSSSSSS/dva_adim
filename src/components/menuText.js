/**
 * @ Author: Jone Chen
 * @ Create Time: 2019-06-19 16:58:23
 * @ Modified by: Jone Chen
 * @ Modified time: 2019-07-18 16:09:41
 * @ Description:权限控制，permission 1==超级管理员，其它为普通用户
 */

export const menuText = [
	{
		path: '/Products',
		title: '产品列表',
		icon: 'home',
	},
	{
		path: '/vipList',
		title: '会员列表',
		icon: 'file',
	},
	{
		path: '/company',
		title: '公司库',
		icon: 'file',
	},
	{
		path: '/error',
		title: '错误页面',
		icon: 'switcher',
		children: [
			{
				path: '/error/404',
				title: '404'
			},
			{
				path: '/error/500',
				title: '500'
			}
		]
	},

];
