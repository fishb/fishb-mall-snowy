<template>
	<view>
		<tui-tabs :top="0" :isFixed="true" :tabs="segmentedList" :currentTab="curView" @change="(e) => {
				if (curView != e.index) {
					curView = e.index
					loadData(true)
				}
			}"></tui-tabs>
		<view class="msg-list">
			<view class="item" v-for="(item, index) in msgData" :key="index" :index="index" @tap="clickMsg(item, index)">
				<uv-row>
					<uv-col span="11">
						<view class="item-title snowy-bold snowy-ellipsis" :class="!!item.read ? 'item-grey': ''">{{item.subject}}</view>
					</uv-col>
					<uv-col span="1">
						<view class="snowy-flex-end" v-show="!item.read">
							<uv-badge :isDot="true" type="error"></uv-badge>
						</view>
					</uv-col>
				</uv-row>
				<uv-row customStyle="margin-top: 15rpx">
					<uv-col span="12">
						<view class="item-sub-title snowy-ellipsis">{{item.createTime}}</view>
					</uv-col>
				</uv-row>
				<uv-row customStyle="margin-top: 15rpx">
					<uv-col span="12">
						<view class="item-sub-title snowy-ellipsis">{{item.content}}</view>
					</uv-col>
				</uv-row>
			</view>
		</view>
		<snowy-empty v-show="$xeu.isEmpty(msgData)" :fixed="true" />
	</view>
</template>
<script setup>
	import { nextTick, reactive, ref } from "vue"
	import { userLoginUnreadMessagePage } from '@/api/sys/userCenterApi'
	import { onLoad, onShow, onReady, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app"
	const curView = ref(0)
	const segmentedList = ref([])
	const messageCategoryList = uni.$snowy.tool.dictList('MESSAGE_CATEGORY')
	if (!uni.$xeu.isEmpty(messageCategoryList)) {
		messageCategoryList.forEach(item => {
			segmentedList.value.push({
				name: item.text
			})
		})
	}
	const searchFormState = reactive({})
	const parameter = reactive({
		current: 1,
		size: 10
	})
	const msgData = ref([])
	// 加载数据
	const loadData = (isReset) => {
		if (isReset) {
			parameter.current = 1
			msgData.value = []
		}
		searchFormState.category = uni.$xeu.isEmpty(messageCategoryList) ? '' : messageCategoryList[curView.value]?.value
		Object.assign(parameter, searchFormState)
		userLoginUnreadMessagePage(parameter).then(res => {
			if (uni.$xeu.isEmpty(res?.data?.records)) {
				return
			}
			msgData.value = msgData.value.concat(res.data.records)
			parameter.current++
		}).finally(() => {
			uni.stopPullDownRefresh()
		})
	}
	onShow(() => {
		loadData(true)
	})
	// 下拉刷新
	onPullDownRefresh(() => {
		loadData(true)
	})
	// 上拉加载
	onReachBottom(() => {
		loadData()
	})
	const clickMsg = (item) => {
		uni.navigateTo({
			url: `/pages/msg/detail?id=${item.id}&createTime=${item.createTime}`
		})
	}
</script>
<style lang="scss" scoped>
	.msg-list {
		margin-top: 85rpx;
	}
	.item {
		background: #ffffff;
		margin: 15rpx 0;
		padding: 40rpx 25rpx;
		box-shadow: 0 1px 2px #ccc;
		border-radius: 15rpx;
	
		.item-title {
			font-size: 28rpx;
		}
	
		.item-sub-title {
			color: #999;
			font-size: 25rpx;
		}
	}
	
	.item-grey {
		color: #999;
	}
	
	.item:hover {
		box-shadow: 1upx 5upx 5upx #5677fc;
	}
</style>