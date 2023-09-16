<template>
	<view class="container">
		<!-- 轮播图 -->
		<uv-swiper :list="data" keyName="image" indicator indicatorMode="line" circular></uv-swiper>
		<!-- 宫格组件 -->
		<view class="item snowy-shadow" v-for="(userMenu, i) in userMobileMenus" :index="i" :key="userMenu.id" style="background-color: #ffffff;">
			<uv-row customStyle="padding: 10px">
				<uv-col span="0.8">
					<uv-icon custom-prefix="snowy" :name="userMenu.icon" size="16" :color="userMenu.color"></uv-icon>
				</uv-col>
				<uv-col span="4">
					{{userMenu.name}}
				</uv-col>
				<uv-col span="7.2" textAlign="right">
					<text v-for="(item,index) in allSelData[userMenu.id]" :key="index" :style=" { marginLeft: '5px', color: index === (allSelData[userMenu.id].length-1) ?'#8799a3':'#1890FF'}" @click="clickText(item,index, userMenu.id)">
						{{item.name + (index === (allSelData[userMenu.id].length-1) ? '' : ' | ') }}
					</text>
				</uv-col>
			</uv-row>
			<uv-grid :border="false" :col="4">
				<uv-grid-item v-for="(item, j) in handleData(userMenu.id, userMenu.children)" :index="j" :key="handleKey(item,j)" @tap="gridItemClick(userMenu.id, item, j)">
					<view class="grid-item-box">
						<snowy-icon :backgroundColor="item.color" custom-prefix="snowy" :name="item.icon" size="20" color="#FFFFFF"></snowy-icon>
						<text class="text">{{item.title}}</text>
					</view>
				</uv-grid-item>
			</uv-grid>
		</view>
	</view>
</template>
<script setup>
	import store from '@/store'
	import XEUtils from 'xe-utils'
	import config from '@/config'
	import { reactive, ref, getCurrentInstance } from "vue"
	import { prefixUrl } from "@/utils/apiAdaptive"
	const { proxy } = getCurrentInstance()
	const data = reactive([{
		image: `${store.getters.allEnv[store.getters.envKey].baseUrl}${prefixUrl('/images/')}swiper/swiper1.jpg`
	}, {
		image: `${store.getters.allEnv[store.getters.envKey].baseUrl}${prefixUrl('/images/')}swiper/swiper2.jpg`
	}])
	const userMobileMenus = store.getters.userMobileMenus
	// 当前选中的数据
	let selData = reactive({})
	// 所有选中的数据
	let allSelData = reactive({})
	if (userMobileMenus && userMobileMenus.length > 0) {
		userMobileMenus.forEach(item => {
			allSelData[item.id] = []
			allSelData[item.id].push(item)
			selData[item.id] = []
		})
	}
	const clickText = (item, index, userMenuId) => {
		// 菜单进行更新
		handleData(item.id, item.children).forEach(itemData => {
			itemData.key = itemData.key + 1
		})
		selData[userMenuId] = item.children
		// 已选中的部分数据进行删除
		allSelData[userMenuId].splice(index + 1, allSelData[userMenuId].length - index);
	}
	const handleData = (userMenuId, userMenuChildren) => {
		return selData[userMenuId] && selData[userMenuId].length > 0 ? selData[userMenuId] : userMenuChildren
	}
	const handleKey = (item, j) => {
		item.key = j
		return item.key
	}
	const gridItemClick = (userMenuId, item, j) => {
		if (item.children && item.children.length > 0) {
			// 菜单进行更新
			item.key = item.key + 1
			selData[userMenuId] = item.children
			// 向已选中的数据中添加新的数据
			allSelData[userMenuId].push(item)
		} else if (item.menuType == 'MENU') {
			uni.navigateTo({
				url: item.path,
				fail(error) {
					proxy.$modal.alert('请将【' + item.title + '】的移动端路由地址(' + item.path + ')与uniapp的page.json的path路径对应！')
					console.error(error)
				}
			})
		} else if (item.menuType == 'IFRAME') {
			uni.navigateTo({
				url: `/pages/common/webview/index?url=${item.path}`,
			})
		} else if (item.menuType == 'LINK') {
			// #ifdef H5
			self.location.href = item.path
			// #endif
			// #ifndef H5
			uni.navigateTo({
				url: `/pages/common/webview/index?url=${item.path}`,
			})
			// #endif
		}
	}
</script>
<style lang="scss" scoped>
	.container {
		.item {
			margin: 15rpx 0;
		}
	}

	.text {
		text-align: center;
		font-size: 26rpx;
		margin-top: 10rpx;
	}

	.grid-item-box {
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 15upx 0;
	}
</style>