<template>
	<view class="home-config">
		<uv-notice-bar direction="column" disableScroll :text="['首页调整完成后,请重新登录,谢谢!']"></uv-notice-bar>
		<view style="margin-top: 20rpx;">
			<view class="item" v-for="(item, index) in homeConfigs" :key="index" :index="index">
				<uv-row>
					<uv-col span="1" @tap="moreOpt(item,index)">
						<uv-icon size="20" name="tags-fill" color="#5677fc"></uv-icon>
					</uv-col>
					<uv-col span="9" @tap="moreOpt(item,index)">
						<view class="item-left">{{item.name}}</view>
					</uv-col>
					<uv-col span="2">
						<switch :checked="item.isShow" style="transform:scale(0.7)" @change="(e)=>switchChange(item, e)" />
					</uv-col>
				</uv-row>
			</view>
		</view>
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
	.home-config {}

	.item {
		background: #ffffff;
		margin-bottom: 15rpx;
		padding: 25rpx;
		border-radius: 15rpx;

		.item-left {
			color: #5677fc;
			font-weight: bold;
			text-shadow: 2px 2px 4px #ccc;
		}
	}
</style>