import App from './App'
import './interceptor'
import { createSSRApp } from 'vue'
import store from './store'
import uvUI from '@/uni_modules/uv-ui-tools'
import XEUtils from '@/plugins/xe-utils'
import snowy from '@/plugins/snowy'

export function createApp() {
	const app = createSSRApp(App)
	app.use(store)
	app.use(uvUI)
	
	app.config.globalProperties.$snowy = snowy
	app.config.globalProperties.$xeu = XEUtils
	
	uni.$snowy = snowy
	uni.$xeu = XEUtils
	
	return {
		app
	}
}