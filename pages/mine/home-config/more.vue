<template>
	<uni-popup ref="popupRef" type="bottom" safeArea>
		<view class="container">
			<uni-list :border="false">
				<uni-list-item v-if="confIndex != 0" title="上移" class="item" :clickable="true" @click="up">
				</uni-list-item>
				<uni-list-item v-if="confIndex != configs.length-1" title="下移" class="item" :clickable="true" @click="down">
				</uni-list-item>
				<uni-list-item title="取消" class="item" :clickable="true" @click="cancel">
				</uni-list-item>
			</uni-list>
		</view>
	</uni-popup>
</template>
<script setup>
	import store from '@/store'
	import { reactive, ref, getCurrentInstance } from "vue"
	// 弹出ref
	const popupRef = ref()
	// 打开
	const configs = ref([])
	const confIndex = ref()
	const open = (data, index) => {
		configs.value = data
		confIndex.value = index
		popupRef.value.open("bottom")
	}
	// 上移
	const up = () => {
		swapArray(configs.value, confIndex.value - 1, confIndex.value)
		store.commit("SET_homeConfigs", configs.value)
		popupRef.value.close()
	}
	// 下移
	const down = () => {
		swapArray(configs.value, confIndex.value, confIndex.value + 1)
		store.commit("SET_homeConfigs", configs.value)
		popupRef.value.close()
	}
	//数组元素互换位置
	const swapArray = (arr, index1, index2) => {
		arr[index1] = arr.splice(index2, 1, arr[index1])[0];
		return arr;
	}
	// 取消
	const cancel = () => {
		popupRef.value.close()
	}
	defineExpose({
		open
	})
</script>
<style lang="scss" scoped>
	.container {
		margin: 15upx;
		border-radius: 5upx;
		padding: 5upx;
		background-color: $uni-white;

		.item {
			text-align: center;
		}
	}
</style>