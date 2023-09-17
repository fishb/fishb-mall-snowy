<script setup>
	import { onShow } from "@dcloudio/uni-app"
	import store from '@/store'
	// #ifdef H5
	import { getH5RouteByUrl } from '@/utils/common'
	import { checkPermission } from '@/utils/auth'
	checkPermission(getH5RouteByUrl())
	//#endif
	store.dispatch('GetSysBaseConfig')
	onShow(() => {
		// #ifdef APP-PLUS
		if (plus.runtime.launcher == 'shortcut') {
			const cmd = JSON.parse(plus.runtime.arguments);
			const type = cmd && cmd.type;
			if (type && type == "sweep") {
				// 执行要操作的逻辑
			}
			plus.runtime.arguments = null;
		}
		//#endif
	})
</script>
<style lang="scss">
	@import '@/static/scss/index.scss';
</style>
