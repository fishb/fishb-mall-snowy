<template>
	<view>
		<view class="sticky">
			<uni-segmented-control :current="curView" :values="segmentedList"
				styleType="button" activeColor="#007aff" @clickItem="(e) => {
					if (curView != e.currentIndex) {
						curView = e.currentIndex
						loadData(true)
					}
				}">
			</uni-segmented-control>
		</view>
		<view class="msg-list">
			<uni-list>
				<uni-list-item 
					v-for="(item, index) in msgData"
					:key="index"
					:showArrow="false"
					:clickable="true"
					:rightText="item.createTime"
					@click="clickMsg(item, index)">
					<template v-slot:body>
						<uni-row>
							<uni-col :span="24">
								<view class="msg-title">
									{{item.subject}}
								</view>
							</uni-col>
							<uni-col :span="24">
								<view class="msg-content">
									<rich-text :nodes="item.content"></rich-text>
								</view>
							</uni-col>
							<uni-col :span="24">
								<view class="msg-footer">
									{{item.createTime}}
								</view>
							</uni-col>
						</uni-row>
					</template>
					<template v-slot:footer>
						<uni-icons v-show="!item.read" type="smallcircle-filled" size="10" color="#e43d33"></uni-icons>
					</template>
				</uni-list-item>
			</uni-list>
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
	import { userLoginUnreadMessagePage } from '@/api/sys/userCenterApi.js'
	import {
		onLoad,
		onShow,
		onReady,
		onPullDownRefresh,
		onReachBottom
	} from "@dcloudio/uni-app"
	
	const curView = ref(0)
	const segmentedList = ref([])
	const messageCategoryList = tool.dictList('MESSAGE_CATEGORY')
	if(!XEUtils.isEmpty(messageCategoryList)){
		messageCategoryList.forEach(item => {
			segmentedList.value.push(item.text)
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
		searchFormState.category = XEUtils.isEmpty(messageCategoryList)?'':messageCategoryList[curView.value]?.value
		Object.assign(parameter, searchFormState)
		userLoginUnreadMessagePage(parameter).then(res => {
			if (XEUtils.isEmpty(res?.data?.records)) {
				return
			}
			msgData.value = msgData.value.concat(res.data.records)
			parameter.current++
		}).finally(()=>{
			uni.stopPullDownRefresh()
		})
	}
	onShow(()=>{
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
		margin: 15upx;
		border-radius: 5upx;
		.msg-title {
			color: #3a3a3a;
			margin: 20upx 0;
			font-size: 30upx;
			font-weight: bold;
		}
		.msg-content {
			color: #909399;
			font-size: 26upx;
		}
		.msg-footer {
			margin-top: 20upx;
			color: #909399;
			font-size: 26upx;
			text-align: right;
		}
	}
</style>