<template>
	<view class="edit-container">
		<uni-forms ref="formRef" :model="formData" :rules="rules" validate-trigger="blur" label-position="top" labelWidth="75px">
			<uni-forms-item label="姓名" name="name" required :rules="[{ required: true, errorMessage: '请输入账号' }]">
				<uni-easyinput v-model="formData.name" placeholder="请输入姓名"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item label="手机" name="phone">
				<uni-easyinput v-model="formData.phone" placeholder="请输入手机"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item label="昵称" name="nickname">
				<uni-easyinput v-model="formData.nickname" placeholder="请输入昵称"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item label="性别" name="gender">
				<uni-data-checkbox v-model="formData.gender" :localdata="genderOptions" />
			</uni-forms-item>
			<uni-forms-item label="生日" name="birthday">
				<uni-datetime-picker type="date" return-type="string" format="YYYY-MM-DD"
					v-model="formData.birthday" />
			</uni-forms-item>
			<uni-forms-item label="邮箱" name="email">
				<uni-easyinput v-model="formData.email" placeholder="请输入邮箱"></uni-easyinput>
			</uni-forms-item>
		</uni-forms>
		<button class="btn-sub" type="primary" @click="submit">提交</button>
	</view>
</template>

<script setup>
	import { userUpdateUserInfo } from '@/api/system/userCenterApi'
	import {
		reactive,
		ref
	} from "vue";
	import {
		onLoad,
		onReady
	} from '@dcloudio/uni-app'
	import store from '@/store/index.js'
	import tool from '@/plugins/tool'
	import modal from '@/plugins/modal'
	import XEUtils from 'xe-utils'

	import storage from '@/utils/storage'
	import constant from '@/utils/constant'

	const formRef = ref()
	const formData = ref(XEUtils.clone(store.getters.userInfo, true))
	const rules = reactive({
		phone: {
			rules: [{
				pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
				errorMessage: '请填写符合要求的11位手机号'
			}]
		},
		email: {
			rules: [{
				pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
				errorMessage: '请填写正确的邮箱号',
			}, ]
		},
	})
	// 性别
	const genderOptions = tool.dictList('GENDER')
	// 提交
	const submit = () => {
		formRef.value.validate().then(res => {
			userUpdateUserInfo(formData.value).then(response =>{
				// 更新缓存
				store.commit('SET_userInfo', formData.value)
				modal.msgSuccess('修改成功')
			})
		})
	}
</script>

<style lang="scss">
	.edit-container {
		margin: 15upx;
		border-radius: 5upx;
		padding: 25upx;
		background-color: $uni-white;
		.btn-sub {
			background-color: $uni-primary;
		}
	}
</style>
