<template>
	<view class="empty-box" :style="{ height: boxHeight }">
		<image :style="{ height: imageHeight }" :src="imgUrl" mode="aspectFit"></image>
	</view>
</template>
<script setup>
	const props = defineProps({
		imgUrl: {
			type: String,
			required: false,
			default: "/static/empty.svg",
		},
		boxHeight: {
			type: String,
			required: false,
			default: "800upx",
		},
		imageHeight: {
			type: String,
			required: false,
			default: "100vw",
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