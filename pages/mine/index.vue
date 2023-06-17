<template>
	<view class="mine-container" :style="{height: `${windowHeight}px`}">
		<!-- 顶部个人信息 -->
		<view class="header-section">
			<view class="avatar-section">
				<view class="icon" v-if="!avatar">
					<uni-icons type="person" size="30" color="#808080"></uni-icons>
				</view>
				<image class="avatar" v-if="avatar" @click="handleToAvatar" :src="avatar" mode="aspectFit"></image>
				<view v-if="!name" @click="handleToLogin" class="login-tip">
					点击登录
				</view>
				<view class="user-info" @click="handleToInfo" v-if="name">
					<view class="title">
						{{name}}
					</view>
				</view>
			</view>
			<view class="avatar-title" @click="handleToInfo">
				<text>个人信息</text>
				<uni-icons type="forward" size="20" color="#ffffff"></uni-icons>
			</view>
		</view>

		<view class="content-section">
			<uni-grid :column="4" :showBorder="false">
				<uni-grid-item @tap="handleToHomeConfig">
					<view class="grid-item-box">
						<snowy-icon backgroundColor = "#2979ff" type="home-filled" size="30" color="#FFFFFF">
						</snowy-icon>
						<text class="text">首页设置</text>
					</view>
				</uni-grid-item>
				<uni-grid-item @tap="handleBuilding">
					<view class="grid-item-box">
						<snowy-icon backgroundColor = "#fa3534" type="flag-filled" size="30" color="#FFFFFF">
						</snowy-icon>
						<text class="text">建设中</text>
					</view>
				</uni-grid-item>
				<uni-grid-item @tap="handleBuilding">
					<view class="grid-item-box">
						<snowy-icon backgroundColor = "#ff9900" type="flag-filled" size="30" color="#FFFFFF">
						</snowy-icon>
						<text class="text">建设中</text>
					</view>
				</uni-grid-item>
				<uni-grid-item @tap="handleBuilding">
					<view class="grid-item-box">
						<snowy-icon backgroundColor = "#19be6b" type="flag-filled" size="30" color="#FFFFFF">
						</snowy-icon>
						<text class="text">建设中</text>
					</view>
				</uni-grid-item>
			</uni-grid>
		</view>

		<view class="content-list">
			<uni-list>
				<uni-list-item :show-extra-icon="true" showArrow title="编辑资料" @click="handleToEditInfo" clickable
					:extra-icon="{
						color: '#2979ff',
						size: '20',
						type: 'person'
					}" />
				<uni-list-item :show-extra-icon="true" showArrow title="修改密码" @click="handleToPwd" clickable
					:extra-icon="{
							color: '#2979ff',
							size: '20',
							type: 'locked'
						}" />
			</uni-list>
		</view>
		<button type="primary" class="btn-logout" @click="handleLogout">退出登录</button>
	</view>
</template>

<script setup>
	import SnowyIcon from '@/components/snowy-icon.vue'
	import store from '@/store/index.js'
	import storage from '@/utils/storage'
	import {
		computed
	} from "vue"
	import modal from '@/plugins/modal';
	const name = store.getters.userInfo.name
	const version = store.getters.sysBaseConfig.SNOWY_SYS_VERSION

	const avatar = computed(() => {
		return store.getters.userInfo.avatar
	})
	const windowHeight = computed(() => {
		return uni.getSystemInfoSync().windowHeight - 50
	})
	const handleToInfo = () => {
		uni.navigateTo({
			url: '/pages/mine/info/index'
		})
	}
	const handleToEditInfo = () => {
		uni.navigateTo({
			url: '/pages/mine/info/edit'
		})
	}
	const handleToPwd = () => {
		uni.navigateTo({
			url:'/pages/mine/pwd/index'
		})
	}
	const handleToAvatar = () => {
		uni.showToast({
			title: '模块建设中'
		})
	}
	const handleToLogin = () => {
		uni.reLaunch({
			url: '/pages/login'
		})
	}
	const handleToHomeConfig = () =>{
		uni.navigateTo({
			url:'/pages/mine/home-config/index'
		})
	}
	const handleBuilding = () => {
		uni.showToast({
			title: '模块建设中'
		})
	}
	const handleLogout = () => {
		modal.confirm('确定注销并退出系统吗？').then(() => {
			// 退出
			store.dispatch('LogOut').then(() => {
				// 跳转登录页面
				uni.reLaunch({
					url:'/pages/login'
				})
			})

		})
	}
</script>

<style lang="scss">
	@mixin circular {
		width: 120upx;
		height: 120upx;
		border-radius: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #ffffff;
	}

	.mine-container {
		width: 100%;
		height: 100%;

		.header-section {
			margin: 15upx;
			border-radius: 5upx;
			padding: 60upx 30upx;
			background-color: $uni-primary;
			color: white;
			display: flex;
			justify-content: space-between;

			.avatar-section {
				display: flex;
				align-items: center;

				.icon {
					@include circular;
				}

				.avatar {
					@include circular;
					border: 4upx solid #eaeaea;
				}

				.user-info {
					font-size: 18upx;
					margin-left: 15upx;

					.title {
						font-size: 40upx;
						line-height: 40upx;
					}
				}
			}

			.avatar-title {
				display: flex;
				align-items: center;
			}
		}

		.content-section {
			background-color: #ffffff;
			position: relative;
			margin: 15upx;
			top: 0;

			.grid-item-box {
				flex: 1;
				/* #ifndef APP-NVUE */
				display: flex;
				/* #endif */
				flex-direction: column;
				align-items: center;
				justify-content: center;
				padding: 15px 0;

				.text {
					text-align: center;
					font-size: 26rpx;
					margin-top: 15rpx;
				}
			}
		}
		.content-list {
			margin: 15upx;
		}
		.btn-logout {
			margin: 50upx 15upx;
			background-color: $uni-primary;
		}
	}
</style>
