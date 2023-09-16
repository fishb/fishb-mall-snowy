<template>
	<view class="item">
		<uv-row>
			<uv-col span="1">
				<uv-icon size="18" name="tags-fill" color="#5677fc"></uv-icon>
			</uv-col>
			<uv-col span="5">
				<view class="item-left">账户</view>
			</uv-col>
			<uv-col span="6" textAlign="right">
				<view class="item-right snowy-bold snowy-ellipsis"> {{ userInfo.account }} </view>
			</uv-col>
		</uv-row>
	</view>
	<view class="item">
		<uv-row>
			<uv-col span="1">
				<uv-icon size="18" name="tags-fill" color="#5677fc"></uv-icon>
			</uv-col>
			<uv-col span="5">
				<view class="item-left">姓名</view>
			</uv-col>
			<uv-col span="6" textAlign="right">
				<view class="item-right snowy-bold snowy-ellipsis"> {{ userInfo.name }} </view>
			</uv-col>
		</uv-row>
	</view>
	<view class="item">
		<uv-row>
			<uv-col span="1">
				<uv-icon size="18" name="tags-fill" color="#5677fc"></uv-icon>
			</uv-col>
			<uv-col span="5">
				<view class="item-left">手机</view>
			</uv-col>
			<uv-col span="6" textAlign="right">
				<view class="item-right snowy-bold snowy-ellipsis"> {{ userInfo.phone }} </view>
			</uv-col>
		</uv-row>
	</view>
	<view class="item">
		<uv-row>
			<uv-col span="1">
				<uv-icon size="18" name="tags-fill" color="#5677fc"></uv-icon>
			</uv-col>
			<uv-col span="5">
				<view class="item-left">昵称</view>
			</uv-col>
			<uv-col span="6" textAlign="right">
				<view class="item-right snowy-bold snowy-ellipsis"> {{ userInfo.nickname }} </view>
			</uv-col>
		</uv-row>
	</view>
	<view class="item">
		<uv-row>
			<uv-col span="1">
				<uv-icon size="18" name="tags-fill" color="#5677fc"></uv-icon>
			</uv-col>
			<uv-col span="5">
				<view class="item-left">性别</view>
			</uv-col>
			<uv-col span="6" textAlign="right">
				<view class="item-right snowy-bold snowy-ellipsis"> {{ userInfo.gender }} </view>
			</uv-col>
		</uv-row>
	</view>
	<view class="item">
		<uv-row>
			<uv-col span="1">
				<uv-icon size="18" name="tags-fill" color="#5677fc"></uv-icon>
			</uv-col>
			<uv-col span="5">
				<view class="item-left">生日</view>
			</uv-col>
			<uv-col span="6" textAlign="right">
				<view class="item-right snowy-bold snowy-ellipsis"> {{ userInfo.birthday }} </view>
			</uv-col>
		</uv-row>
	</view>
	<view class="item">
		<uv-row>
			<uv-col span="1">
				<uv-icon size="18" name="tags-fill" color="#5677fc"></uv-icon>
			</uv-col>
			<uv-col span="5">
				<view class="item-left">邮箱</view>
			</uv-col>
			<uv-col span="6" textAlign="right">
				<view class="item-right snowy-bold snowy-ellipsis"> {{ userInfo.email }} </view>
			</uv-col>
		</uv-row>
	</view>
</template>
<script setup>
	import { reactive, ref, computed } from "vue"
	import store from '@/store/index.js'
	const userInfo = computed(() => {
		return store.getters.userInfo
	})
</script>
<style lang="scss" scoped>
	.info-container {
		background-color: #ffffff;
		border-radius: 5upx;
	}

	.item {
		background: #ffffff;
		margin-bottom: 15rpx;
		padding: 25rpx;
		border-radius: 15rpx;

		.item-left {
			color: #999;
			font-size: 26rpx;
		}

		.item-right {
			font-size: 26rpx;
		}
	}
</style>