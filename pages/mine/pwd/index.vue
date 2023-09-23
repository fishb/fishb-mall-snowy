<template>
	<view class="pwd-container snowy-shadow">
		<uv-form ref="formRef" :model="formData" :rules="rules" label-position="top" labelWidth="auto" :labelStyle="{marginBottom: '25rpx', fontSize: '27rpx', color: '#606266'}">
			<uv-form-item prop="oldPassword" label="旧密码" required>
				<uv-input type="password" v-model="formData.oldPassword" placeholder="请输入旧密码" />
			</uv-form-item>
			<uv-form-item prop="newPassword" label="新密码" required>
				<uv-input type="password" v-model="formData.newPassword" placeholder="请输入新密码" />
			</uv-form-item>
			<uv-form-item prop="confirmPassword" label="确认密码" required>
				<uv-input type="password" v-model="formData.confirmPassword" placeholder="请确认新密码" />
			</uv-form-item>
			<tui-button margin="50rpx 0" :preventClick="true" :shadow="true" @click="submit">提交</tui-button>
		</uv-form>
	</view>
</template>
<script setup>
	import { userUpdatePassword } from "@/api/sys/userCenterApi"
	import { onReady } from '@dcloudio/uni-app'
	import { reactive, ref } from 'vue'
	const formRef = ref()
	const formData = ref({
		oldPassword: '',
		newPassword: '',
		confirmPassword: ''
	})
	const rules = {
		oldPassword: [{
			type: 'string',
			required: true,
			message: '旧密码不能为空',
			trigger: ['blur', 'change']
		}],
		newPassword: [{
			type: 'string',
			required: true,
			message: '新密码不能为空',
			trigger: ['blur', 'change']
		}, {
			minLength: 6,
			maxLength: 20,
			message: '长度在 6 到 20 个字符'
		}],
		confirmPassword: [{
			type: 'string',
			required: true,
			message: '确认密码不能为空',
			trigger: ['blur', 'change']
		}, {
			validator: (rule, value, callback) => formData.value.newPassword === value,
			message: '两次输入的密码不一致',
			trigger: ['blur', 'change']
		}],
	}
	const submit = () => {
		formRef.value.validate().then(res => {
			userUpdatePassword({
				password: user.oldPassword,
				newPassword: user.newPassword
			}).then(response => {
				uni.$snowy.modal.msgSuccess('修改成功')
			})
		})
	}
</script>
<style lang="scss" scoped>
	.pwd-container {
		padding: 30rpx;
	}
</style>