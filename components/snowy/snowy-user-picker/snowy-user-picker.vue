<template>
	<snowy-sel-picker v-bind="$attrs" :searchEnabled="true" :searchSeniorEnable="true">
		<template #search #option="data">
		</template>
		<template #option="data">
			<uni-row>
				<uni-col :span="4">
					<image style="width: 75rpx; height: 75rpx; border-radius: 10rpx;" :src="data?.item?.avatar || '/static/logo.png'" mode="widthFix"></image>
				</uni-col>
				<uni-col :span="20">
					<view class="snowy-text-bold">{{data?.item?.name}}</view>
					<view class="snowy-sub-title">
						{{ `${data?.item?.orgName} | ${data?.item?.positionName} | ${data?.item?.genderName}` }}
					</view>
				</uni-col>
			</uni-row>
		</template>
	</snowy-sel-picker>
</template>
<script setup>
</script>
<style lang="scss" scoped>
</style>