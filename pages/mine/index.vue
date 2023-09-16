<template>
	<view class="header snowy-shadow">
		<uv-row>
			<uv-col span="2.5">
				<image class="avatar" v-if="userInfo?.avatar" :src="userInfo?.avatar" mode="aspectFit"></image>
			</uv-col>
			<uv-col span="4">
				<view class="header-left">{{userInfo?.name}}</view>
			</uv-col>
			<uv-col span="5" textAlign="right" @tap="handleToInfo">
				<view class="header-right">个人信息</view>
			</uv-col>
			<uv-col span="0.5" @tap="handleToInfo">
				<uv-icon name="arrow-right" color="white" size="15"></uv-icon>
			</uv-col>
		</uv-row>
	</view>
	<view class="grid snowy-shadow">
		<uv-grid :border="false" :col="4">
			<uv-grid-item @tap="handleToHomeConfig">
				<view class="grid-item-box">
					<snowy-icon backgroundColor="#ff9900" name="home-fill" size="20" color="#FFFFFF"></snowy-icon>
					<text class="text">首页设置</text>
				</view>
			</uv-grid-item>
			<uv-grid-item @tap="handleToHomeConfig">
				<view class="grid-item-box">
					<snowy-icon backgroundColor="#ff9900" name="home-fill" size="20" color="#FFFFFF"></snowy-icon>
					<text class="text">首页设置</text>
				</view>
			</uv-grid-item>
			<uv-grid-item @tap="handleToHomeConfig">
				<view class="grid-item-box">
					<snowy-icon backgroundColor="#ff9900" name="home-fill" size="20" color="#FFFFFF"></snowy-icon>
					<text class="text">首页设置</text>
				</view>
			</uv-grid-item>
			<uv-grid-item @tap="handleToHomeConfig">
				<view class="grid-item-box">
					<snowy-icon backgroundColor="#ff9900" name="home-fill" size="20" color="#FFFFFF"></snowy-icon>
					<text class="text">首页设置</text>
				</view>
			</uv-grid-item>
		</uv-grid>
	</view>
	<view class="menu snowy-shadow">
		<uv-row @click="handleToEditInfo">
			<uv-col span="1">
				<uv-icon name="account-fill" color="#2979ff" size="20"></uv-icon>
			</uv-col>
			<uv-col span="10.5">
				<view class="menu-left">编辑资料</view>
			</uv-col>
			<uv-col span="0.5">
				<uv-icon name="arrow-right" color="#2979ff" size="15"></uv-icon>
			</uv-col>
		</uv-row>
	</view>
	<view class="menu snowy-shadow">
		<uv-row @click="handleToPwd">
			<uv-col span="1">
				<uv-icon name="lock-fill" color="#fa3534" size="20"></uv-icon>
			</uv-col>
			<uv-col span="10.5">
				<view class="menu-left">修改密码</view>
			</uv-col>
			<uv-col span="0.5">
				<uv-icon name="arrow-right" color="#2979ff" size="15"></uv-icon>
			</uv-col>
		</uv-row>
	</view>
	<view class="menu snowy-shadow">
		<uv-row @click="handleLogout">
			<uv-col span="1">
				<uv-icon name="warning-fill" color="#ff9900" size="20"></uv-icon>
			</uv-col>
			<uv-col span="10.5">
				<view class="menu-left">退出登录</view>
			</uv-col>
			<uv-col span="0.5">
				<uv-icon name="arrow-right" color="#2979ff" size="15"></uv-icon>
			</uv-col>
		</uv-row>
	</view>
</template>
<script setup>
	import store from '@/store/index'
	import { computed } from "vue"
	import modal from '@/plugins/modal'
	import config from '@/config'
	import tab from '@/plugins/tab'
	const userInfo = computed(() => {
		return store.getters.userInfo
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
			url: '/pages/mine/pwd/index'
		})
	}
	const handleToHomeConfig = () => {
		uni.navigateTo({
			url: '/pages/mine/home-config/index'
		})
	}
	const handleLogout = () => {
		modal.confirm('确定注销并退出系统吗？').then(() => {
			// 退出
			store.dispatch('LogOut').then(() => {
				tab.reLaunch(config.NO_TOKEN_BACK_URL)
			})
		})
	}
</script>
<style lang="scss" scoped>
	@mixin circular {
		width: 120upx;
		height: 120upx;
		border-radius: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #ffffff;
	}

	.header {
		background: #5677fc;
		margin-bottom: 15rpx;
		padding: 90rpx 25rpx;
		border-radius: 15rpx;

		.avatar {
			@include circular;
			border: 4upx solid #eaeaea;
		}

		.header-left {
			color: white;
			font-size: 40upx;
			line-height: 40upx;
		}

		.header-right {
			color: white;
			font-size: 28rpx;
		}
	}

	.grid {
		background: white;
		margin-bottom: 15rpx;
		padding: 10rpx 10rpx;
		border-radius: 15rpx;
	}

	.menu {
		background: #ffffff;
		margin-bottom: 15rpx;
		padding: 25rpx;
		border-radius: 15rpx;

		.menu-left {
			font-size: 30rpx;
		}

		.menu-right {
			font-size: 28rpx;
		}
	}

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
</style>