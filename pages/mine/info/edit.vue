<template>
	<view class="edit-container snowy-shadow">
		<uv-form ref="formRef" :model="formData" :rules="rules" label-position="top" labelWidth="auto" :labelStyle="{marginBottom: '25rpx', fontSize: '27rpx', color: '#606266'}">
			<uv-form-item label="姓名" prop="name" required>
				<uv-input v-model="formData.name" placeholder="请输入姓名"></uv-input>
			</uv-form-item>
			<uv-form-item label="手机" prop="phone">
				<uv-input v-model="formData.phone" placeholder="请输入手机"></uv-input>
			</uv-form-item>
			<uv-form-item label="昵称" prop="nickname">
				<uv-input v-model="formData.nickname" placeholder="请输入昵称"></uv-input>
			</uv-form-item>
			<uv-form-item label="性别" prop="gender">
				<uv-radio-group v-model="formData.gender">
					<uv-radio :customStyle="{marginRight: '50rpx'}" v-for="(item, index) in genderOptions" :key="index" :label="item.text" :name="item.value">
					</uv-radio>
				</uv-radio-group>
			</uv-form-item>
			<uv-form-item label="生日" prop="birthday">
				<snowy-calendar v-model="formData.birthday" placeholder="请选择出生日期"></snowy-calendar>
			</uv-form-item>
			<uv-form-item label="邮箱" prop="email">
				<uv-input v-model="formData.email" placeholder="请输入邮箱"></uv-input>
			</uv-form-item>
		</uv-form>
		<tui-button margin="50rpx 0" :preventClick="true" :shadow="true" @click="submit">提交</tui-button>
	</view>
</template>
<script setup>
	import { userUpdateUserInfo } from '@/api/sys/userCenterApi'
	import { reactive, ref } from "vue"
	import { onLoad, onReady } from '@dcloudio/uni-app'
	import store from '@/store/index.js'
	import storage from '@/utils/storage'
	import constant from '@/utils/constant'
	const formRef = ref()
	const formData = ref(uni.$xeu.clone(store.getters.userInfo, true))
	const rules = reactive({
		name: [{
			type: 'string',
			required: true,
			message: '请输入姓名',
			trigger: ['blur', 'change']
		}],
		phone: [{
			pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
			message: '请填写符合要求的11位手机号',
			trigger: ['blur', 'change']
		}],
		email: [{
			pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
			message: '请填写正确的邮箱号',
			trigger: ['blur', 'change']
		}],
	})
	// 性别
	const genderOptions = uni.$snowy.tool.dictList('GENDER')
	// 提交
	const submit = () => {
		formRef.value.validate().then(res => {
			userUpdateUserInfo(formData.value).then(response => {
				// 更新缓存
				store.commit('SET_userInfo', formData.value)
				uni.$snowy.modal.msgSuccess('修改成功')
			})
		})
	}
</script>
<style lang="scss" scoped>
	.edit-container {
		padding: 30rpx;
	}
</style>