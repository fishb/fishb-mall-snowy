import store from '@/store'
import {
	getToken
} from '@/utils/auth'
import {
	errorCodeMap,
	reloadCodes
} from '@/utils/errorCode'
import {
	toast,
	showConfirm,
	tansParams
} from '@/utils/common'
import config from '@/config'
import {
	prefixUrl
} from "@/utils/apiAdaptive"

const {
	BASE_URL,
	TIMEOUT,
	TOKEN_NAME,
	TOKEN_PREFIX,
	TENANT_DOMAIN
} = config

const download = config => {
	// 适配URL路径
	config.url = prefixUrl(config.url)
	// 是否需要设置 token
	const isToken = (config.extConf || {}).isToken === false
	config.header = config.header || {}
	if (getToken() && !isToken) {
		config.header[TOKEN_NAME] = TOKEN_PREFIX + getToken()
	}
	config.header.Domain = store.getters.tenantDomain || TENANT_DOMAIN
	// get请求映射params参数
	if (config.params) {
		let url = config.url + '?' + tansParams(config.params)
		url = url.slice(0, -1)
		config.url = url
	}
	return new Promise((resolve, reject) => {
		uni.showLoading({
			title: '努力加载中'
		})
		uni.downloadFile({
			url: (config.baseUrl || BASE_URL) + config.url,
			header: config.header,
			timeout: config.timeout || TIMEOUT,
			success: (response) => {
				resolve(response)
				
			},
			fail: (error) => {
				reject(error)
			},
			complete: () => {
				uni.hideLoading()
			}
		})
	})
}

export default download