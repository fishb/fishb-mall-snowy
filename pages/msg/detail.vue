<template>
	<view class="container">
		<view class="item">
			<uv-row>
				<uv-col span="12">
					<view class="item-title snowy-bold">{{ record?.subject }}</view>
				</uv-col>
			</uv-row>
			<uv-row customStyle="margin-top: 20rpx">
				<uv-col span="12">
					<view class="item-time">{{ record?.createTime }}</view>
				</uv-col>
			</uv-row>
			<uv-row customStyle="margin-top: 20rpx">
				<uv-col span="12">
					<view class="item-content">{{ record?.content }}</view>
				</uv-col>
			</uv-row>
		</view>
		<view class="item" v-for="(item, index) in receiveInfoList" :key="index">
			<uv-row>
				<uv-col span="6">
					<view>姓名</view>
				</uv-col>
				<uv-col span="6" textAlign="right">
					<view>{{ item.receiveUserName }}</view>
				</uv-col>
			</uv-row>
			<uv-row customStyle="margin-top: 20rpx">
				<uv-col span="6">
					<view>是否已读</view>
				</uv-col>
				<uv-col span="6">
					<view class="snowy-flex-end">
						<uv-tags v-if="!!item.read" text="已读" type="info"/>
						<uv-tags v-if="!item.read" text="未读" type="primary" />
					</view>
				</uv-col>
			</uv-row>
		</view>
	</view>
</template>
<script setup>
	import { nextTick, reactive, ref } from "vue"
	import { userLoginUnreadMessageDetail } from '@/api/sys/userCenterApi'
	import { onLoad, onShow, onReady, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app"
	const record = ref({})
	const receiveInfoList = ref([])
	onLoad((option) => {
		if (!option.id) {
			return
		}
		userLoginUnreadMessageDetail({
			id: option.id
		}).then((res) => {
			record.value = res.data
			record.value.createTime = option?.createTime
			receiveInfoList.value = res.data.receiveInfoList
		})
	})
</script>
<style lang="scss" scoped>
	.container {}

	.item {
		background: #ffffff;
		margin-bottom: 25rpx;
		padding: 25rpx;
		box-shadow: 0 1rpx 1rpx #ccc;
		border-radius: 10rpx;

		.item-title {
			font-size: 28rpx;
		}

		.item-time {
			font-size: 26rpx;
			color: #999;
		}

		.item-content {
			font-size: 27rpx;
		}
	}
</style>