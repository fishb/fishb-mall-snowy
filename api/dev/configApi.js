import request from '@/utils/request'

export function configSysBaseList() {
	return request({
		url: '/dev/config/sysBaseList',
		headers: {
			isToken: false
		},
		method: 'get',
		timeout: 20000
	})
}
