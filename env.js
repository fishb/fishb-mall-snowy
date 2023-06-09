const defaultEnvKey = 'local'
const defaultAllEnv = {
	local: {
		name:"本地环境",
		baseUrl: "http://192.168.0.103:82",
		// 后端配置文件的 snowy.config.common.front-url，相当于前端地址（开源版本非必要）
		tenantDomain: "http://localhost:81",
	},
	pro: {
		name:"生产环境",
		baseUrl: "https://snowyapi.xiaonuo.vip",
		// 后端配置文件的 snowy.config.common.front-url，相当于前端地址（开源版本非必要）
		tenantDomain: "https://snowy.xiaonuo.vip",
	},
}
// 应用全局配置
export default {
	DEFAULT_ENV_KEY: defaultEnvKey,
	DEFAULT_ALL_ENV: defaultAllEnv
}