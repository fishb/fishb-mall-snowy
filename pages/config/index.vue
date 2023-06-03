<template>
	<view>
		<view style="margin: 15upx;">
			<uni-row>
				<view style="display: flex; align-items: center; justify-content: center;">
					<uni-col :span="22">
						<uni-search-bar placeholder="请输入环境标题" v-model="searchName" cancelButton="none"></uni-search-bar>
					</uni-col>
					<uni-col :span="2">
						<view style="color: #2979ff;" @click="resetEnv">
							<text>
								重置\n环境
							</text>
						</view>
					</uni-col>
				</view>
			</uni-row>
		</view>
		<uni-card :border="false" v-for="(item, key) in filterEnv(allEnv)" :key="key" :index="key">
			<template v-slot:title>
				<view style="margin-top: 30upx; margin-left: 20upx;">
					<radio-group @change="envChange">
						<label>
							<uni-row>
								<uni-col :span="3">
									<radio :value="key" :checked="key === envKey" />
								</uni-col>
								<uni-col :span="21">
									<view>{{item.name}}</view>
								</uni-col>
							</uni-row>
						</label>
					</radio-group>
				</view>
			</template>
			<view @tap="$refs.morePopupRef.open({key:key, ...item})">
				<uni-row>
					<uni-col :span="6">
						<view>key：</view>
					</uni-col>
					<uni-col :span="18">
						<view>{{key}}</view>
					</uni-col>

					<uni-col :span="6">
						<view>baseUrl：</view>
					</uni-col>
					<uni-col :span="18">
						<view>{{item.baseUrl}}</view>
					</uni-col>
					
					<uni-col :span="6">
						<view>tenant：</view>
					</uni-col>
					<uni-col :span="18">
						<view>{{item.tenantDomain}}</view>
					</uni-col>
				</uni-row>
			</view>
		</uni-card>

		<button type="primary" class="btn-login" @click="loginBtn">登录</button>

		<!-- 新增悬浮按钮 -->
		<uni-fab :pattern="{
				color: '#7A7E83',
				backgroundColor: '#fff',
				selectedColor: '#007AFF',
				buttonColor: '#007AFF',
				iconColor: '#fff'
			}" horizontal="right" vertical="bottom" direction="horizontal" @fabClick="add"></uni-fab>
		<!-- 更多操作 -->
		<morePopup ref="morePopupRef"></morePopup>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive,
		onMounted,
		getCurrentInstance,
		computed
	} from 'vue'
	import store from '@/store'
	import morePopup from './more-popup.vue'
	import XEUtils from "xe-utils"
	import env from '@/env.js'

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
	const envChange = (evt) => {
		// 设置当前环境key
		store.commit('SET_envKey', evt.detail.value)
	}
	const loginBtn = ()=>{
		uni.reLaunch({
			url:'/pages/login'
		})
	}
	// 新增
	const add = () => {
		uni.navigateTo({
			url: '/pages/config/form'
		})
	}
</script>

<style lang="scss">
	page {
		background-color: #ffffff;
	}
	.btn-login {
		margin: 50upx 25upx;
		background-color: $uni-primary;
	}
</style>