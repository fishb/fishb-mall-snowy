import App from './App'
import './interceptor'
import XEUtils from 'xe-utils'
import VXEUtils from 'vxe-utils'
import { createSSRApp } from 'vue'
import tab from '@/plugins/tab'
import modal from '@/plugins/modal'
import store from './store'
import tool from '@/plugins/tool'
import { hasPerm } from '@/plugins/permission'
export function createApp() {
	const app = createSSRApp(App)
	app.use(VXEUtils, XEUtils, {
		mounts: ['cookie']
	})
	app.config.globalProperties.$tab = tab
	app.config.globalProperties.$modal = modal
	app.config.globalProperties.$store = store
	app.config.globalProperties.$tool = tool
	app.config.globalProperties.hasPerm = hasPerm
	return {
		app
	}
}