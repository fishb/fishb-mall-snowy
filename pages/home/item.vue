<template>
	<view>
		<!-- 轮播图 -->
		<view v-if="['swiper',].includes(code) && isShow">
			<home-swiper></home-swiper>
		</view>
		<!-- 图表 插件地址：https://ext.dcloud.net.cn/plugin?id=271 官方地址：https://www.ucharts.cn/v2/#/demo/index-->
		<view class="item" v-if="['chart',].includes(code) && isShow">
			<home-chart></home-chart>
		</view>
		<!-- 日程 -->
		<view class="item" v-if="['schedule',].includes(code) && isShow">
			<home-schedule></home-schedule>
		</view>
	</view>
</template>

<script setup>
	import HomeSwiper from './home-swiper.vue'
	import HomeChart from './home-chart.vue'
	import HomeSchedule from './home-schedule/index.vue'
	
	const props = defineProps({
		code: {
			type: String,
			default: '',
			required: true
		},
		isShow: {
			type: Boolean,
			default: '',
			required: true
		},
	})
</script>

<style lang="scss">
	.item {
		background-color: #ffffff;
		margin: 15upx 0;
		padding: 30upx 15upx;
	}
</style>