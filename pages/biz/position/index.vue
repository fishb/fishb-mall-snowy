<template>
	<view class="crumb">
		<text class="crumb-text" v-for="(item, index) in allSelOrg" :key="index"
			:class="index === (allSelOrg.length-1) ? 'uni-secondary-color' : 'uni-primary'"
			@click="clickOrgCru(item, index)">
			{{ item.name + (index === (allSelOrg.length-1) ? '' : ' | ') }}
		</text>
	</view>
	<view class="biz-list">
		<uni-list>
			<view>
				<uni-list-item v-for="(item, index) in curSelOrg" :key="index" :title="item.name"
					:showArrow="item.children? true : false" :clickable="true" @click="clickOrg(item, index)">
				</uni-list-item>
			</view>
			<view>
				<uni-list-item v-for="(item, index) in positionData" :key="index" :title="item.name" :clickable="true"
					@click="morePopupRef.open(item)">
					<template v-slot:header>
						<view v-if="item.category == 'HIGH'" style="background-color: #f3a73f; width: 42px; height: 42px;">
							<snowy-icon type="vip-filled" size="20" color="#FFFFFF"></snowy-icon>
						</view>
						<view v-else-if="item.category == 'MIDDLE'" style="background-color: #2979ff; width: 42px; height: 42px;">
							<snowy-icon type="auth-filled" size="20" color="#FFFFFF"></snowy-icon>
						</view>
						<view v-else style="background-color: #18bc37; width: 42px; height: 42px;">
							<snowy-icon type="staff-filled" size="20" color="#FFFFFF"></snowy-icon>
						</view>
					</template>
					<template v-slot:body>
						<view class="biz-list-body">
							<text class="biz-list-body-name">{{item.name}}</text>
							<text class="biz-list-body-category">{{ $tool.dictTypeData('POSITION_CATEGORY', item.category)}}</text>
						</view>
					</template>
					<template v-slot:footer>

					</template>
				</uni-list-item>
			</view>
		</uni-list>
	</view>
	<uni-load-more status="noMore" />
	<!-- 新增悬浮按钮 -->
	<uni-fab v-if="hasPerm('mobileBizPositionAdd')" :pattern="{
			color: '#7A7E83',
			backgroundColor: '#fff',
			selectedColor: '#007AFF',
			buttonColor: '#007AFF',
			iconColor: '#fff'
		}" horizontal="right" vertical="bottom" direction="horizontal" @fabClick="add"></uni-fab>
	<!-- 更多操作 -->
	<morePopup ref="morePopupRef" @handleOk="loadData(true)"></morePopup>
</template>

<script setup>
	import {
		orgTree
	} from '@/api/biz/bizOrgApi'
	import {
		positionPage
	} from '@/api/biz/bizPositionApi'

	import {
		reactive,
		ref,
		getCurrentInstance
	} from "vue"

	import {
		onLoad,
		onShow,
		onReady,
		onPullDownRefresh,
		onReachBottom
	} from "@dcloudio/uni-app"
	import morePopup from '@/pages/biz/position/more-popup.vue'
	import SnowyIcon from '@/components/snowy-icon.vue'
	const morePopupRef = ref()

	// 所有选择的机构
	let allSelOrg = ref([])
	// 当前选择的机构
	let curSelOrg = ref([])

	orgTree().then(res => {
		curSelOrg.value = res.data
		allSelOrg.value.push({
			id: '0',
			name: '全部',
			children: res.data
		})
	})

	let searchFormState = reactive({})
	let parameter = reactive({
		current: 1,
		size: 10
	})

	let positionData = ref([])
	// 加载数据
	const loadData = (isReset = false) => {
		if (isReset) {
			// 重置分页
			parameter.current = 1
			// 重置数据
			positionData.value = []
		}
		Object.assign(parameter, searchFormState)
		positionPage(parameter).then(res => {
			if (res.data && res.data.records && res.data.records.length > 0) {
				positionData.value = positionData.value.concat(res.data.records)
				parameter.current++
			}
			uni.stopPullDownRefresh()
		})
	}
	loadData(true)

	// 点击机构面包屑
	const clickOrgCru = (item, index) => {
		curSelOrg.value = item.children
		allSelOrg.value.splice(index + 1, allSelOrg.value.length - (index + 1))

		searchFormState.orgId = (item.id === '0' ? null : item.id)
		// uni.startPullDownRefresh()
		loadData(true)
	}

	// 点击机构
	const clickOrg = (item, index) => {
		curSelOrg.value = item.children
		allSelOrg.value.push(item)

		searchFormState.orgId = item.id
		// uni.startPullDownRefresh()
		loadData(true)
	}

	// 展示
	onShow(() => {
		uni.$on('formBack', (data) => {
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

<style lang="scss">
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
	.biz-list {
		margin: 15upx;
		border-radius: 5upx;
		.biz-list-body {
			display: flex;
			flex-direction: column;
			flex: 1;
			overflow: hidden;
			padding: 2px 0;
			.biz-list-body-name {
				flex: 1;
				font-size: 14px;
				margin: 0 10px;
			}
			.biz-list-body-category {
				flex: 1;
				font-size: 12px;
				margin: 5px 10px;
				color:#999;
			}
		}
	}
</style>
