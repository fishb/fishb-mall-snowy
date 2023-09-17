<template>
	<view>
		<tui-section padding="20rpx 50rpx" title="日程" is-line line-cap="square" :line-right="20" background="#fff" :size="28"></tui-section>
		<uv-calendars :insert="true" :lunar="true" @change="change" :showMonth="false" />
		<view class="add-schedule snowy-bold" @tap="add"> 新增 </view>
		<view class="item" v-for="schedule in scheduleList" :key="schedule.id">
			<uv-row>
				<uv-col span="1">
					<uv-icon size="18" name="clock-fill" color="#5677fc" @click="del(schedule)"></uv-icon>
				</uv-col>
				<uv-col span="8">
					<view class="item-left snowy-bold snowy-ellipsis">{{schedule.scheduleContent}}</view>
				</uv-col>
				<uv-col span="2" textAlign="right">
					<view class="item-right snowy-bold snowy-ellipsis"> {{schedule.scheduleTime}} </view>
				</uv-col>
				<uv-col span="1">
					<view class="snowy-flex-end">
						<uv-icon size="18" name="trash-fill" color="#e43d33" @click="del(schedule)"></uv-icon>
					</view>
				</uv-col>
			</uv-row>
		</view>
		<add-pop ref="addPopRef" @ok="seleScheduleList()"></add-pop>
	</view>
</template>
<script setup>
	import { reactive, ref, getCurrentInstance, computed } from "vue"
	import { indexScheduleList, indexScheduleDeleteSchedule } from '@/api/sys/indexApi'
	import XEUtils from 'xe-utils'
	import AddPop from './add-pop.vue'
	const scheduleList = ref([])
	const scheduleDate = ref(XEUtils.toDateString(new Date(), 'yyyy-MM-dd'))
	const addPopRef = ref()
	const seleScheduleList = () => {
		indexScheduleList({
			scheduleDate: scheduleDate.value
		}).then((res) => {
			scheduleList.value = res.data
		})
	}
	seleScheduleList()
	const change = (e) => {
		scheduleDate.value = e.fulldate
		seleScheduleList()
	}
	const add = () => {
		addPopRef.value.onOpen(scheduleDate)
	}
	const del = (schedule) => {
		const params = [{
			id: schedule.id
		}]
		indexScheduleDeleteSchedule(params).then(() => {
			seleScheduleList()
		})
	}
</script>
<style lang="scss" scoped>
	.add-schedule {
		cursor: pointer;
		margin: 25upx;
		color: #5677fc;
		text-align: right;
		font-size: 30upx;
	}

	.item {
		padding: 25rpx;

		.item-left {
			font-size: 26rpx;
		}

		.item-right {
			color: #999;
			font-size: 26rpx;
		}
	}
</style>