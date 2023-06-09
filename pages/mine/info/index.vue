<template>
	<view class="info-container">
		<uni-list>
			<uni-list-item showExtraIcon="true" :extraIcon="{type: 'auth-filled'}" title="账户"
				:rightText="userInfo.account"></uni-list-item>
			<uni-list-item showExtraIcon="true" :extraIcon="{type: 'person-filled'}" title="姓名"
				:rightText="userInfo.name"></uni-list-item>
			<uni-list-item showExtraIcon="true" :extraIcon="{type: 'phone-filled'}" title="手机"
				:rightText="userInfo.phone"></uni-list-item>
			<uni-list-item showExtraIcon="true" :extraIcon="{type: 'vip-filled'}" title="昵称"
				:rightText="userInfo.nickname"></uni-list-item>
			<uni-list-item showExtraIcon="true" :extraIcon="{type: 'staff-filled'}" title="性别"
				:rightText="userInfo.gender">
			</uni-list-item>
			<uni-list-item showExtraIcon="true" :extraIcon="{type: 'calendar-filled'}" title="生日"
				:rightText="userInfo.birthday"></uni-list-item>
			<uni-list-item showExtraIcon="true" :extraIcon="{type: 'email-filled'}" title="邮箱"
				:rightText="userInfo.email"></uni-list-item>
		</uni-list>
	</view>
</template>

<script setup>
	import {
		reactive,
		ref,
		computed
	} from "vue"
	import store from '@/store/index.js'
	
	const userInfo = computed(() => {
		return store.getters.userInfo
	})
</script>

<style lang="scss">
	page{
		padding: 15upx;
	}
	.info-container {
		background-color: #ffffff;
		border-radius: 5upx;
	}
</style>
