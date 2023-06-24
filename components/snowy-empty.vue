<template>
	<view class="empty-box">
		<text>{{ tips }}</text>
	</view>
</template>

<script setup>
	const props = defineProps({
		tips: {
			type: String,
			required: false,
			default: "页面数据为空",
		},
	})
</script>

<style lang="scss" scoped>
	.empty-box {
		height: 800upx;
		/* #ifndef APP-NVUE */
		display: flex;
		justify-content: center;
		align-items: center;
		/* #endif */
		color: #666666;
		border: none;
	}
</style>