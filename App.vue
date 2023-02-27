<script>
	import store from '@/store'
	import {
		getToken,
		checkPermission
	} from '@/utils/auth'
	import config from '@/config'
	import {
		configSysBaseList
	} from '@/api/dev/configApi'

	export default {
		onLaunch: function() {
			store.dispatch('GetSysBaseConfig')
			//#ifdef H5
			checkPermission(location.pathname)
			//#endif
		},
		onShow: function() {
			// #ifdef APP-PLUS
			if(plus.runtime.launcher=='shortcut'){
				var cmd = JSON.parse(plus.runtime.arguments);  
				var type=cmd&&cmd.type;
				  if(type&&type=="sweep"){
				    // 执行要操作的逻辑
				}
				plus.runtime.arguments=null;
			}
			//#endif
		},
		onHide: function() {}
	}
</script>

<style lang="scss">
	@import '@/static/scss/index.scss';
</style>
