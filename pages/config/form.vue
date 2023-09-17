<template>
	<view class="container snowy-shadow">
		<uv-form ref="formRef" :model="formData" :rules="rules" label-position="top" labelWidth="auto" :labelStyle="{marginBottom: '25rpx', fontSize: '27rpx', color: '#606266'}">
			<uv-form-item label="环境KEY" prop="key" required>
				<uv-input v-model="formData.key" placeholder="请输入环境key"></uv-input>
			</uv-form-item>
			<uv-form-item label="环境名称" prop="name" required>
				<uv-input v-model="formData.name" placeholder="请输入环境名称"></uv-input>
			</uv-form-item>
			<uv-form-item label="baseUrl" prop="baseUrl" required>
				<uv-input v-model="formData.baseUrl" placeholder="请输入baseUrl"></uv-input>
			</uv-form-item>
			<uv-form-item label="tenantDomain" prop="tenantDomain" required>
				<uv-input v-model="formData.tenantDomain" placeholder="请输入tenantDomain"></uv-input>
			</uv-form-item>
		</uv-form>
		<tui-button margin="50rpx 0" :preventClick="true" :shadow="true" @click="submit">提交</tui-button>
	</view>
</template>
<script setup>
	import { nextTick, reactive, ref } from "vue"
	import store from '@/store'
	import XEUtils from "xe-utils"
	import { onLoad, onShow, onReady, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app"
	const formRef = ref()
	const formData = ref({
		key: '',
		name: '',
		baseUrl: '',
		tenantDomain: ''
	})
	const rules = reactive({
		key: [{
			type: 'string',
			required: true,
			message: '请输入环境key',
			trigger: ['blur', 'change']
		}],
		name: [{
			type: 'string',
			required: true,
			message: '请输入环境名称',
			trigger: ['blur', 'change']
		}],
		baseUrl: [{
			type: 'string',
			required: true,
			message: '请输入baseUrl',
			trigger: ['blur', 'change']
		}],
	})
	// 加載
	onLoad((option) => {
		if (!option.record) {
			return
		}
		formData.value = JSON.parse(decodeURIComponent(option.record));
	})
	const submit = () => {
		formRef.value.validate().then(res => {
			let obj = XEUtils.clone(store.getters.allEnv, true)
			obj[formData.value.key] = {
				name: formData.value.name,
				baseUrl: formData.value.baseUrl,
				tenantDomain: formData.value.tenantDomain,
			}
			store.commit('SET_allEnv', obj)
			uni.navigateBack({
				delta: 1
			})
		})
	}
</script>
<style lang="scss" scoped>
	.container {
		padding: 30rpx;
	}
</style>