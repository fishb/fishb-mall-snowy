<template>
	<view class="mine-container" :style="{height: `${windowHeight}px`}">
		<!-- 顶部个人信息 -->
		<view class="header-section">
			<view class="avatar-section">
				<view class="icon" v-if="!avatar">
					<uni-icons type="person" size="30" color="#808080"></uni-icons>
				</view>
				<image class="avatar" v-if="avatar" @click="handleToAvatar" :src="avatar"
					mode="widthFix"></image>
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
				<uni-grid-item @click="handleBuilding">
					<view class="grid-item-box">
						<snowy-icon style="background-color:#2979ff;" type="flag-filled" size="30" color="#FFFFFF">
						</snowy-icon>
						<text class="text">建设中</text>
					</view>
				</uni-grid-item>
				<uni-grid-item @click="handleBuilding">
					<view class="grid-item-box">
						<snowy-icon style="background-color:#fa3534;" type="flag-filled" size="30" color="#FFFFFF">
						</snowy-icon>
						<text class="text">建设中</text>
					</view>
				</uni-grid-item>
				<uni-grid-item @click="handleBuilding">
					<view class="grid-item-box">
						<snowy-icon style="background-color:#ff9900;" type="flag-filled" size="30" color="#FFFFFF">
						</snowy-icon>
						<text class="text">建设中</text>
					</view>
				</uni-grid-item>
				<uni-grid-item @click="handleBuilding">
					<view class="grid-item-box">
						<snowy-icon style="background-color:#19be6b;" type="flag-filled" size="30" color="#FFFFFF">
						</snowy-icon>
						<text class="text">建设中</text>
					</view>
				</uni-grid-item>
			</uni-grid>
		</view>


		<view class="menu-list">
			<view class="list-cell list-cell-arrow" @click="handleToEditInfo">
				<view class="menu-item-box">
					<view class="iconfont icon-user menu-icon"></view>
					<view>编辑资料</view>
				</view>
			</view>
			<view class="list-cell list-cell-arrow" @click="handleHelp">
				<view class="menu-item-box">
					<view class="iconfont icon-help menu-icon"></view>
					<view>常见问题</view>
				</view>
			</view>
			<view class="list-cell list-cell-arrow" @click="handleAbout">
				<view class="menu-item-box">
					<view class="iconfont icon-aixin menu-icon"></view>
					<view>关于我们</view>
				</view>
			</view>
			<view class="list-cell list-cell-arrow" @click="handleToSetting">
				<view class="menu-item-box">
					<view class="iconfont icon-setting menu-icon"></view>
					<view>应用设置</view>
				</view>
			</view>
		</view>
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
	const handleToSetting = () => {
		uni.navigateTo({
			url: '/pages/mine/setting/index'
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
	const handleHelp = () => {
		uni.showToast({
			title: '模块建设中'
		})
	}
	const handleAbout = () => {
		uni.showToast({
			title: '模块建设中'
		})
	}

	const handleBuilding = () => {
		uni.showToast({
			title: '模块建设中'
		})
	}
</script>

<style lang="scss">
	page {
		background-color: #f5f6f7;
	}
	.mine-container {
		width: 100%;
		height: 100%;
		.header-section {
			margin: 15upx;
			border-radius: 5upx;
			padding: 60upx 30upx;
			background-color: $uni-color-primary;
			color: white;
			display: flex;
			justify-content: space-between;
			.avatar-section {
				display: flex;
				align-items: center;
				.icon {
					width: 120upx;
					height: 120upx;
					border-radius: 5000upx;
					display: flex;
					align-items: center;
					justify-content: center;
					background-color: #ffffff;
				}
				.avatar {
					width: 128upx;
					height: 128upx;
					border-radius: 5000upx;
					display: flex;
					align-items: center;
					justify-content: center;
					background-color: #ffffff;
										
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
	}
</style>
