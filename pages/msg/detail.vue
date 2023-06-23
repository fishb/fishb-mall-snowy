<template>
	<view>
		<view class="container">
			<view class="item-row">
				<uni-row>
					<uni-col :span="4">
						<view class="item-row-title">主题</view>
					</uni-col>
					<uni-col :span="20">
						<view class="item-row-content">
							{{ record?.subject }}
						</view>
					</uni-col>
				</uni-row>
			</view>
			<view class="item-row">
				<uni-row>
					<uni-col :span="4">
						<view class="item-row-title">发送时间</view>
					</uni-col>
					<uni-col :span="20">
						<view class="item-row-content">
							{{ record?.createTime }}
						</view>
					</uni-col>
				</uni-row>
			</view>
			<view class="item-row">
				<uni-row>
					<uni-col :span="4">
						<view class="item-row-title">内容</view>
					</uni-col>
					<uni-col :span="20">
						<view class="item-row-content">
							{{ record?.content }}
						</view>
					</uni-col>
				</uni-row>
			</view>
		</view>
		
		<view class="container">
			<uni-row>
				<uni-col :span="24">
					<view class="item-row-title">查收情况</view>
				</uni-col>
			</uni-row>
			<view class="table-list">
				<uni-table border stripe emptyText="暂无更多数据">
					<uni-tr>
						<uni-th align="center">姓名</uni-th>
						<uni-th align="center">是否已读</uni-th>
					</uni-tr>
					<uni-tr v-for="(item, index) in receiveInfoList" :key="index">
						<uni-td align="center">{{ item.receiveUserName }}</uni-td>
						<uni-td align="center">
							<uni-tag v-if="!!item.read" text="已读" />
							<uni-tag v-if="!item.read" text="未读" type="primary" />
						</uni-td>
					</uni-tr>
				</uni-table>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		nextTick,
		reactive,
		ref
	} from "vue"
	import tool from '@/plugins/tool.js'
	import XEUtils from 'xe-utils'
	import { userLoginUnreadMessageDetail } from '@/api/sys/userCenterApi.js'
	import {
		onLoad,
		onShow,
		onReady,
		onPullDownRefresh,
		onReachBottom
	} from "@dcloudio/uni-app"
	const record = ref({})
	const receiveInfoList = ref([])
	onLoad((option)=>{
		if(!option.id){
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
	.container {
		margin: 15upx;
		border-radius: 5upx;
		padding: 25upx;
		background-color: $uni-white;
		
	}
	.item {
		width: 100vw;
	}
	.item-row {
		margin: 20upx 10upx;	
	}
	.item-row-title {
		font-size: 25upx;
		color: #999;
	}
	.item-row-content {
		font-size: 25upx;
		text-align: right;
	}
	.table-list {
		margin-top: 30upx;
	}
</style>