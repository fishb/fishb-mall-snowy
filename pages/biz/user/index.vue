<template>
	<!-- 搜索 -->
	<snowy-search placeholder="请输入流程名称" v-model="searchFormState.searchKey" @confirm="loadData(true)" @clear="loadData(true)"></snowy-search>
	<!-- 面包屑 -->
	<view class="crumb snowy-shadow">
		<text v-for="(item, index) in allSelOrg" :key="index" class="text-center" @click="clickOrgCru(item, index)" :class="index === (allSelOrg.length-1) ? 'uni-secondary-color' : 'uni-primary'">
			{{ item.name + (index === (allSelOrg.length-1) ? '' : ' | ') }}
		</text>
	</view>
	<!-- 组织 -->
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
	<!-- 用户 -->
	<view class="user-list snowy-shadow">
		<tui-list-view unlined="all">
			<tui-list-cell v-for="(item, index) in userData" :key="index" :line-left="0" :hover="true" :arrow="false" @click="moreClick(item)">
				<view class="item">
					<image class="item-img" :src="item.avatar" mode="widthFix"></image>
					<view class="item-left">{{item.name}}</view>
					<view class="item-right">{{item.orgName + ' | '+ item.positionName +' | '+item.genderName}}</view>
				</view>
			</tui-list-cell>
		</tui-list-view>
		<snowy-empty v-show="$xeu.isEmpty(userData)" />
	</view>
	<!-- 新增 -->
	<snowy-float-btn v-if="$snowy.hasPerm('mobileBizUserAdd')" @click="add"></snowy-float-btn>
	<!-- 更多 -->
	<more ref="moreRef" @handleOk="loadData(true)"></more>
</template>
<script setup>
	import more from '@/pages/biz/user/more.vue'
	import { orgTree } from '@/api/biz/bizOrgApi'
	import { userPage } from '@/api/biz/bizUserApi'
	import { reactive, ref, getCurrentInstance } from "vue"
	import { onLoad, onShow, onReady, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app"
	// 新增悬浮按钮
	const add = () => {
		uni.navigateTo({
			url: '/pages/biz/user/form'
		})
	}
	// 更多操作
	const moreRef = ref()
	const moreClick = (record) => {
		moreRef.value.open(record)
	}
	// 所有选择的机构
	const allSelOrg = ref([])
	// 当前选择的机构
	const curSelOrg = ref([])
	orgTree().then(res => {
		curSelOrg.value = res.data
		allSelOrg.value.push({
			id: '0',
			name: '顶级',
			children: res.data
		})
	})
	// 用户相关逻辑
	const searchFormState = reactive({})
	const parameter = reactive({
		current: 1,
		size: 10
	})
	const userData = ref([])
	// 加载数据
	const loadData = (isReset) => {
		if (isReset) {
			parameter.current = 1
			userData.value = []
		}
		Object.assign(parameter, searchFormState)
		userPage(parameter).then(res => {
			if (uni.$xeu.isEmpty(res?.data?.records)) {
				return
			}
			userData.value = userData.value.concat(res.data.records)
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
</script>
<style lang="scss" scoped>
	.crumb {
		margin-top: 15upx;
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
		margin: 20rpx 0;
		padding: 5rpx 0;
		background-color: white;
	}

	.user-list {
		margin: 20rpx 0;
		padding: 5rpx 0;
		background-color: white;
	}

	.item {
		width: 100%;
		display: flex;
		align-items: center;

		.item-img {
			width: 70rpx;
			height: 70rpx;
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