<template>
	<view class="container-icon" :style="{ backgroundColor: backgroundColor }">
		<uni-icons v-bind="$attrs">
		</uni-icons>
	</view>
</template>

<script setup>
	const props = defineProps({
		backgroundColor: {
			type: String,
			required: false
		},
	})
</script>

<style lang="scss" scoped>
	.container-icon {
		width: 80upx;
		height: 80upx;
		border-radius: 25upx;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 1upx 4upx 5upx rgba(72, 22, 174, 0.3);
	}
</style>
