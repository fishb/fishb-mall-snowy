<template>
	<view class="home-config">
		<!-- scrollable -->
		<uni-notice-bar show-icon text="首页调整完成后,请重新登录,谢谢!" />
		<uni-list>
			<uni-list-item v-for="(item, index) in homeConfigs" :key="index" :index="index" :clickable="false">
				<template v-slot:header>
					<view style="font-size: 28upx; color: #2979ff;" @tap="moreOpt(item,index)">
						{{item.name}}
					</view>
				</template>
				<template v-slot:footer>
					<view>
						<switch :checked="item.isShow" style="transform:scale(0.7)" @change="(e)=>switchChange(item, e)" />
					</view>
				</template>
			</uni-list-item>
		</uni-list>
		<!-- 更多操作 @handleOk=""-->
		<more ref="moreRef"></more>
	</view>
</template>
<script setup>
	import store from '@/store'
	import { reactive, ref, getCurrentInstance, computed } from "vue"
	import more from './more.vue'
	// 快捷用户菜单
	const homeConfigs = computed(() => {
		return store.getters.homeConfigs
	})
	const switchChange = (item, e) => {
		item.isShow = e.detail.value
		store.commit("SET_homeConfigs", homeConfigs.value)
	}
	const moreRef = ref()
	const moreOpt = (item, index) => {
		moreRef.value.open(homeConfigs.value, index)
	}
</script>
<style lang="scss" scoped>
	.home-config {
		margin: 15upx;
	}
</style>