import request from '@/utils/request'

// 获取用户分页
export function userSelector(data, url) {
	return request({
		url: url || '/biz/org/userSelector',
		method: 'get',
		data: data
	})
}
// 根据id集合获取用户集合
export function getUserListByIdList(data, url) {
	return request({
		url: url || '/sys/userCenter/getUserListByIdList',
		method: 'post',
		data: data
	})
}