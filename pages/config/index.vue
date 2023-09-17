<template>
	<view>
		<snowy-search v-model="searchName" :enableSenior="true">
			<view @click="resetEnv">
				<text> 重置\n环境 </text>
			</view>
		</snowy-search>
		<view class="item" v-for="(item, key) in filterEnv(allEnv)" :key="key" :index="key">
			<view @tap="switchEnv(key)" class="item">
				<uv-row>
					<uv-col span="6">
						<uv-icon v-if="key === envKey" size="20" name="integral-fill" color="#007AFF"></uv-icon>
						<uv-icon v-else size="20" name="integral"></uv-icon>
					</uv-col>
					<uv-col span="6" textAlign="right">
						<view class="item-right snowy-bold snowy-ellipsis"> {{item.name}} </view>
					</uv-col>
				</uv-row>
			</view>
			<view @tap="$refs.moreRef.open({key:key, ...item})" class="item">
				<uv-row customStyle="margin-top: 15rpx">
					<uv-col span="6">
						<view class="item-left">key：</view>
					</uv-col>
					<uv-col span="6" textAlign="right">
						<view class="item-right snowy-bold snowy-ellipsis"> {{ key }} </view>
					</uv-col>
				</uv-row>
				<uv-row customStyle="margin-top: 15rpx">
					<uv-col span="6">
						<view class="item-left">baseUrl：</view>
					</uv-col>
					<uv-col span="6" textAlign="right">
						<view class="item-right snowy-bold snowy-ellipsis"> {{item.baseUrl}} </view>
					</uv-col>
				</uv-row>
				<uv-row customStyle="margin-top: 15rpx">
					<uv-col span="6">
						<view class="item-left">tenant：</view>
					</uv-col>
					<uv-col span="6" textAlign="right">
						<view class="item-right snowy-bold snowy-ellipsis"> {{item.tenantDomain}} </view>
					</uv-col>
				</uv-row>
			</view>
		</view>
		<tui-button margin="50rpx 0" :preventClick="true" :shadow="true" @click="loginBtn">确认</tui-button>
		<snowy-float-btn @click="add"></snowy-float-btn>
		<more ref="moreRef"></more>
	</view>
</template>
<script setup>
	import { ref, reactive, onMounted, getCurrentInstance, computed } from 'vue'
	import store from '@/store'
	import more from './more.vue'
	import XEUtils from "xe-utils"
	import env from '@/env'
	const searchName = ref('')
	const envKey = computed(() => {
		return store.getters.envKey
	})
	const allEnv = computed(() => {
		return store.getters.allEnv
	})
	// 过滤
	const filterEnv = (allEnv) => {
		const obj = {}
		XEUtils.objectEach(allEnv, (item, key) => {
			if (!searchName.value || item.name.indexOf(searchName.value) != -1) {
				obj[key] = item
			}
		})
		return obj
	}
	// 重置
	const resetEnv = () => {
		store.commit('SET_envKey', env.DEFAULT_ENV_KEY)
		store.commit('SET_allEnv', env.DEFAULT_ALL_ENV)
	}
	// 切换
	const switchEnv = (key) => {
		// 设置当前环境key
		store.commit('SET_envKey', key)
	}
	const loginBtn = () => {
		uni.reLaunch({
			url: '/pages/login'
		})
	}
	// 新增
	const add = () => {
		uni.navigateTo({
			url: '/pages/config/form'
		})
	}
</script>
<style lang="scss" scoped>
	.item {
		background: #ffffff;
		margin: 20rpx 0;
		padding: 25rpx;
		box-shadow: 0 1px 2px #ccc;
		border-radius: 15rpx;

		.item-left {
			color: #999;
			font-size: 26rpx;
		}

		.item-right {
			font-size: 26rpx;
		}
	}

	.item:hover {
		box-shadow: 1upx 5upx 5upx #5677fc;
	}
</style>