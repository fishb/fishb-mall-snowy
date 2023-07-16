<template>
	<view class="empty-box">
		<image :src="imgUrl" mode="aspectFit"></image>
	</view>
</template>
<script setup>
	const props = defineProps({
		imgUrl: {
			type: String,
			required: false,
			default: "/static/empty.svg",
		}
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