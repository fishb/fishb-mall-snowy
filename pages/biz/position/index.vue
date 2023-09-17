<template>
	<view class="crumb snowy-shadow">
		<text class="crumb-text" v-for="(item, index) in allSelOrg" :key="index" :class="index === (allSelOrg.length-1) ? 'uni-secondary-color' : 'uni-primary'" @click="clickOrgCru(item, index)">
			{{ item.name + (index === (allSelOrg.length-1) ? '' : ' | ') }}
		</text>
	</view>
	<view class="org-list snowy-shadow">
		<tui-list-view unlined="all">
			<tui-list-cell v-for="(item, index) in curSelOrg" :key="index" :line-left="0" :hover="item.children? true : false" :arrow="item.children? true : false" @click="clickOrg(item, index)">
				<view class="item">
					<image v-if="item.category === 'COMPANY'" class="item-img" src="/static/svg/org/company.svg" mode="widthFix"></image>
					<image v-if="item.category === 'DEPT'" class="item-img" src="/static/svg/org/department.svg" mode="widthFix"></image>
					<view class="item-left">{{item.name}}</view>
					<view class="item-right"></view>
				</view>
			</tui-list-cell>
		</tui-list-view>
	</view>
	<view class="biz-list snowy-shadow">
		<tui-list-view unlined="all">
			<tui-list-cell v-for="(item, index) in positionData" :key="index" :line-left="0" :hover="true" :arrow="false" @click="$refs.moreRef.open(item)">
				<view class="item">
					<view v-if="item.category == 'HIGH'" style="width: 42px; height: 42px;">
						<snowy-icon backgroundColor="#f3a73f" name="integral" size="20" color="#FFFFFF"></snowy-icon>
					</view>
					<view v-else-if="item.category == 'MIDDLE'" style="width: 42px; height: 42px;">
						<snowy-icon backgroundColor="#2979ff" name="pushpin" size="20" color="#FFFFFF"></snowy-icon>
					</view>
					<view v-else style="width: 42px; height: 42px;">
						<snowy-icon backgroundColor="#18bc37" name="account" size="20" color="#FFFFFF"></snowy-icon>
					</view>
					<view class="item-left">{{item.name}}</view>
					<view class="item-right">{{ $tool.dictTypeData('POSITION_CATEGORY', item.category)}}</view>
				</view>
			</tui-list-cell>
		</tui-list-view>
		<snowy-empty v-show="$utils.isEmpty(positionData)" />
	</view>
	<snowy-float-btn v-if="hasPerm('mobileBizPositionAdd')" @click="add"></snowy-float-btn>
	<!-- 更多操作 -->
	<more ref="moreRef" @handleOk="loadData(true)"></more>
</template>
<script setup>
	import { orgTree } from '@/api/biz/bizOrgApi'
	import { positionPage } from '@/api/biz/bizPositionApi'
	import { reactive, ref, getCurrentInstance } from "vue"
	import { onLoad, onShow, onReady, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app"
	import more from '@/pages/biz/position/more.vue'
	import { hasPerm } from '@/plugins/permission'
	import XEUtils from 'xe-utils'
	// 所有选择的机构
	const allSelOrg = ref([])
	// 当前选择的机构
	const curSelOrg = ref([])
	orgTree().then(res => {
		curSelOrg.value = res?.data || []
		allSelOrg.value.push({
			id: '0',
			name: '全部',
			children: res?.data || []
		})
	})
	const searchFormState = reactive({})
	const parameter = reactive({
		current: 1,
		size: 10
	})
	const positionData = ref([])
	// 加载数据
	const loadData = (isReset) => {
		if (isReset) {
			parameter.current = 1
			positionData.value = []
		}
		Object.assign(parameter, searchFormState)
		positionPage(parameter).then(res => {
			if (XEUtils.isEmpty(res?.data?.records)) {
				return
			}
			positionData.value = positionData.value.concat(res.data.records)
			parameter.current++
		}).finally(() => {
			uni.stopPullDownRefresh()
		})
	}
	loadData(true)
	// 点击机构面包屑
	const clickOrgCru = (item, index) => {
		curSelOrg.value = item.children
		allSelOrg.value.splice(index + 1, allSelOrg.value.length - (index + 1))
		searchFormState.orgId = (item.id === '0' ? '' : item.id)
		loadData(true)
	}
	// 点击机构
	const clickOrg = (item, index) => {
		curSelOrg.value = item.children
		allSelOrg.value.push(item)
		searchFormState.orgId = item.id
		loadData(true)
	}
	// 展示
	onShow(() => {
		uni.$once('formBack', (data) => {
			loadData(true)
		})
	})
	// 下拉刷新
	onPullDownRefresh(() => {
		loadData(true)
	})
	// 上拉加载
	onReachBottom(() => {
		loadData()
	})
	// 新增悬浮按钮
	const add = () => {
		uni.navigateTo({
			url: '/pages/biz/position/form'
		})
	}
</script>
<style lang="scss" scoped>
	.crumb {
		border-radius: 5upx;
		white-space: nowrap;
		overflow-x: scroll;
		background-color: white;
		padding: 20upx;

		.crumb-text {
			display: inline-block;
			margin-left: 5px;
			text-align: center;
		}
	}

	.org-list {
		margin: 15rpx 0;
		padding: 5rpx 0;
		background-color: white;
	}

	.biz-list {
		margin: 15upx 0;
		padding: 5rpx 0;
		background-color: white;
	}

	.item {
		width: 100%;
		display: flex;
		align-items: center;

		.item-img {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
			display: block;
			margin-right: 5rpx;
			flex-shrink: 0;
		}

		.item-left {
			padding-left: 20rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.item-right {
			margin-left: auto;
			margin-right: 34rpx;
			font-size: 26rpx;
			color: #999;
		}
	}
</style>