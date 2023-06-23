<template>
	<view class="crumb">
		<text class="crumb-text" v-for="(item, index) in allSelOrg" :key="index" @click="clickOrgCru(item, index)"
			:class="index === (allSelOrg.length-1) ? 'uni-secondary-color' : 'uni-primary'">
			{{ item.name + (index === (allSelOrg.length-1) ? '' : ' | ') }}
		</text>
	</view>
	<view class="org-list">
		<uni-list>
			<uni-list-item v-for="(item, index) in curSelOrg" :key="index">
				<!-- 名称 -->
				<template v-slot:body>
					<text class="org-list-name" @click="morePopupRef.open(item)">{{item.name}}</text>
				</template>
				<!-- 右侧icon -->
				<template v-slot:footer>
					<uni-icons v-if="item.children? true : false" type="right" @click="clickOrg(item, index)">
					</uni-icons>
				</template>
			</uni-list-item>
		</uni-list>
	</view>
	<!-- 新增悬浮按钮 -->
	<uni-fab v-if="hasPerm('mobileBizOrgAdd')" :pattern="{
			color: '#7A7E83',
			backgroundColor: '#fff',
			selectedColor: '#007AFF',
			buttonColor: '#007AFF',
			iconColor: '#fff'
		}" horizontal="right" vertical="bottom" direction="horizontal" @fabClick="add"></uni-fab>
	<!-- 更多操作 -->
	<morePopup ref="morePopupRef" @handleOk="loadData()"></morePopup>
</template>

<script setup>
	import {
		orgTree
	} from '@/api/biz/bizOrgApi'

	import {
		reactive,
		ref,
		getCurrentInstance
	} from "vue";
	import {
		onLoad,
		onShow,
		onReady,
		onPullDownRefresh,
		onReachBottom
	} from "@dcloudio/uni-app"

	import morePopup from '@/pages/biz/org/more-popup.vue'

	const morePopupRef = ref()

	// 所有选择的机构
	const allSelOrg = ref([])
	// 当前选择的机构
	const curSelOrg = ref([])

	// 展示
	onShow(() => {
		uni.$once('formBack', (data) => {
			loadData()
		})
	})

	const loadData = () => {
		orgTree().then(res => {
			curSelOrg.value = res?.data || []
			allSelOrg.value = [{
				id: '0',
				name: '全部',
				children: res?.data || []
			}]
		})
	}
	loadData()

	const clickOrgCru = (item, index) => {
		curSelOrg.value = item.children
		allSelOrg.value.splice(index + 1, allSelOrg.value.length - (index + 1))
	}

	const clickOrg = (item, index) => {
		if (item.children) {
			curSelOrg.value = item.children
			allSelOrg.value.push(item)
		}
	}

	// 新增悬浮按钮
	const add = () => {
		uni.navigateTo({
			url: '/pages/biz/org/form'
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

	.org-list {
		margin: 15upx;
		border-radius: 5upx;

		.org-list-name {
			flex: 1;
		}
	}
</style>
