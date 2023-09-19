<template>
	<view class="crumb snowy-shadow">
		<text class="text" v-for="(item, index) in allSelOrg" :key="index" @click="clickOrgCru(item, index)" :class="index === (allSelOrg.length-1) ? 'uni-secondary-color' : 'uni-primary'">
			{{ item.name + (index === (allSelOrg.length-1) ? '' : ' | ') }}
		</text>
	</view>
	<view class="list snowy-shadow">
		<tui-list-view unlined="all">
			<tui-swipe-action v-for="(item, index) in curSelOrg" :key="index" :actions="actions" :params="item" @click="handlerButton">
				<template v-slot:content>
					<tui-list-cell :line-left="0" :hover="item.children? true : false" :arrow="item.children? true : false" @click="clickOrg(item, index)">
						<view class="item">
							<image v-if="item.category === 'COMPANY'" class="item-img" src="/static/svg/org/company.svg" mode="widthFix"></image>
							<image v-if="item.category === 'DEPT'" class="item-img" src="/static/svg/org/department.svg" mode="widthFix"></image>
							<view class="item-left">{{item.name}}</view>
							<view class="item-right"></view>
						</view>
					</tui-list-cell>
				</template>
			</tui-swipe-action>
		</tui-list-view>
		<snowy-empty v-show="$utils.isEmpty(curSelOrg)"/>
	</view>
	<snowy-float-btn v-if="hasPerm('mobileBizOrgAdd')" @click="add"></snowy-float-btn>
</template>
<script setup>
	import { orgTree, orgDelete } from '@/api/biz/bizOrgApi'
	import { reactive, ref, getCurrentInstance, nextTick } from "vue";
	import { onLoad, onShow, onReady, onPullDownRefresh } from "@dcloudio/uni-app"
	import { hasPerm } from '@/plugins/permission'
	import modal from '@/plugins/modal'
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
	const actions = []
	if (hasPerm(['mobileBizOrgEdit'])) {
		actions.push({
			name: '修改',
			color: '#fff',
			fontsize: 30,
			width: 70,
			background: '#5677fc'
		})
	}
	if (hasPerm(['mobileBizOrgDelete'])) {
		actions.push({
			name: '删除',
			color: '#fff',
			fontsize: 30,
			width: 70,
			background: '#FD3B31'
		})
	}
	const handlerButton = ({ index, item }) => {
		if ('修改' === actions[index]?.name) {
			return uni.navigateTo({
				url: '/pages/biz/org/form?id=' + item.id
			})
		}
		if ('删除' === actions[index]?.name) {
			return modal.confirm(`是否确认删除【${ item.name }】机构？`).then(() => {
				orgDelete([{
					id: item.id
				}]).then(res => {
					loadData()
				})
			})
		}
	}
</script>
<style lang="scss" scoped>
	.crumb {
		white-space: nowrap;
		overflow-x: scroll;
		padding: 20rpx;

		.text {
			display: inline-block;
			margin-left: 5rpx;
			text-align: center;
		}
	}

	.list {
		margin: 15rpx 0;
		background-color: white;
		padding: 5rpx 0;

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
	}
</style>