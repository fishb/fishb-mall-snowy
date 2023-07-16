<template>
	<!-- 搜索 -->
	<uni-search-bar v-model="searchFormState.searchKey" @confirm="loadData(true)"></uni-search-bar>
	<!-- 自定义面包屑 -->
	<view class="crumb">
		<text v-for="(item, index) in allSelOrg" :key="index" class="text-center" @click="clickOrgCru(item, index)" :class="index === (allSelOrg.length-1) ? 'uni-secondary-color' : 'uni-primary'">
			{{ item.name + (index === (allSelOrg.length-1) ? '' : ' | ') }}
		</text>
	</view>
	<view class="user-list">
		<uni-list>
			<!-- 机构 -->
			<uni-list-item v-for="(item, index) in curSelOrg" :key="index" :title="item.name" :showArrow="true" :clickable="true" @click="clickOrg(item, index)"></uni-list-item>
			<!-- 人员 -->
			<uni-list-chat v-for="(item, index) in userData" :key="index" :title="item.name" :avatar="item.avatar" :note="item.orgName + ' | '+ item.positionName +' | '+item.genderName" :time="item.entryDate" :clickable="true" @click="moreClick(item)">
			</uni-list-chat>
		</uni-list>
		<snowy-empty v-if="$utils.isEmpty(userData)" />
	</view>
	<!-- 新增悬浮按钮 -->
	<uni-fab v-if="hasPerm('mobileBizUserAdd')" :pattern="{
			color: '#7A7E83',
			backgroundColor: '#fff',
			selectedColor: '#007AFF',
			buttonColor: '#007AFF',
			iconColor: '#fff'
		}" horizontal="right" vertical="bottom" direction="horizontal" @fabClick="add"></uni-fab>
	<!-- 更多操作 -->
	<more ref="moreRef" @handleOk="loadData(true)"></more>
</template>
<script setup>
	import more from '@/pages/biz/user/more.vue'
	import { orgTree } from '@/api/biz/bizOrgApi'
	import { userPage } from '@/api/biz/bizUserApi'
	import { reactive, ref, getCurrentInstance } from "vue"
	import { onLoad, onShow, onReady, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app"
	import XEUtils from 'xe-utils'
	import SnowyEmpty from "@/components/snowy-empty.vue"
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
	let allSelOrg = ref([])
	// 当前选择的机构
	let curSelOrg = ref([])
	orgTree().then(res => {
		curSelOrg.value = res.data
		allSelOrg.value.push({
			id: '0',
			name: '顶级',
			children: res.data
		})
	})
	// 用户相关逻辑
	let searchFormState = reactive({})
	let parameter = reactive({
		current: 1,
		size: 10
	})
	let userData = ref([])
	// 加载数据
	const loadData = (isReset) => {
		if (isReset) {
			parameter.current = 1
			userData.value = []
		}
		Object.assign(parameter, searchFormState)
		userPage(parameter).then(res => {
			if (XEUtils.isEmpty(res?.data?.records)) {
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
		margin: 15upx;
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

	.user-list {
		margin: 15upx;
		border-radius: 5upx;
	}
</style>