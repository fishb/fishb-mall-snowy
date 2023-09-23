<template>
	<view class="container snowy-shadow">
		<uv-form ref="formRef" :model="formData" :rules="rules" label-position="top" labelWidth="auto" :labelStyle="{marginBottom: '25rpx', fontSize: '27rpx', color: '#606266'}">
			<uv-form-item label="上级机构" prop="parentId" required>
				<snowy-org-picker v-model="formData.parentId" :isTopLevel="true" placeholder="请选择上级机构" :org-tree-api="selectorApiFunction.orgTreeSelectorApi">
				</snowy-org-picker>
			</uv-form-item>
			<uv-form-item label="机构名称" prop="name" required>
				<uv-input v-model="formData.name" placeholder="请输入机构名称" fontSize="27rpx"></uv-input>
			</uv-form-item>
			<uv-form-item label="机构分类" prop="category" required>
				<uv-radio-group v-model="formData.category">
					<uv-radio :customStyle="{marginRight: '50rpx'}" v-for="(item, index) in orgCategoryOptions" :key="index" :label="item.text" :name="item.value">
					</uv-radio>
				</uv-radio-group>
			</uv-form-item>
			<uv-form-item label="排序" prop="sortCode" required>
				<uv-number-box v-model="formData.sortCode" button-size="30" :step="1" :max="100"></uv-number-box>
			</uv-form-item>
			<uv-form-item label="指定主管" prop="directorId">
				<snowy-user-picker v-model="formData.directorId" placeholder="请选择主管" :org-tree-api="selectorApiFunction.orgTreeSelectorApi" :user-page-api="selectorApiFunction.userPageApi" :checked-user-list-api="selectorApiFunction.checkedUserListApi">
				</snowy-user-picker>
			</uv-form-item>
		</uv-form>
		<tui-button margin="50rpx 0" :preventClick="true" :shadow="true" @click="submit">提交</tui-button>
	</view>
</template>
<script setup>
	import { nextTick, reactive, ref } from "vue"
	import { orgTreeSelector, orgUserSelector, orgDetail, submitForm } from '@/api/biz/bizOrgApi'
	import { onLoad, onShow, onReady, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app"
	import { userCenterGetUserListByIdList } from '@/api/sys/userCenterApi'
	const formRef = ref()
	const formData = ref({
		parentId: '',
		name: '',
		category: '',
		sortCode: 99,
		directorId: ''
	})
	const rules = reactive({
		parentId: [{
			type: 'string',
			required: true,
			message: '请选择上级机构',
			trigger: ['blur', 'change']
		}],
		name: [{
			type: 'string',
			required: true,
			message: '请输入机构名称',
			trigger: ['blur', 'change']
		}],
		category: [{
			type: 'string',
			required: true,
			message: '请选择机构分类',
			trigger: ['blur', 'change']
		}],
		sortCode: [{
			type: 'number',
			required: true,
			message: '请输入排序',
			trigger: ['blur', 'change']
		}],
	})
	const orgCategoryOptions = uni.$snowy.tool.dictList('ORG_CATEGORY')
	const selectorApiFunction = {
		orgTreeSelectorApi: (param) => {
			return orgTreeSelector(param).then((res) => {
				return Promise.resolve(res)
			})
		},
		userPageApi: (param) => {
			return orgUserSelector(param).then((res) => {
				return Promise.resolve(res)
			})
		},
		checkedUserListApi: (param) => {
			return userCenterGetUserListByIdList(param).then((res) => {
				return Promise.resolve(res)
			})
		}
	}
	// 加載
	onLoad((option) => {
		if (!option.id) {
			return
		}
		orgDetail({ id: option.id }).then(res => {
			formData.value = res?.data
		})
	})
	const submit = () => {
		formRef.value.validate().then(res => {
			submitForm(formData.value, !formData.value.id).then(respond => {
				uni.$emit('formBack', {
					data: respond.data
				})
				uni.navigateBack({
					delta: 1
				})
			})
		})
	}
</script>
<style lang="scss" scoped>
	.container {
		padding: 30rpx;
	}
</style>