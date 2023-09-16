<template>
	<view class="container snowy-shadow">
		<uv-form ref="formRef" :model="formData" :rules="rules" label-position="top" labelWidth="auto" :labelStyle="{marginBottom: '25rpx', fontSize: '27rpx', color: '#606266'}">
			<uv-form-item label="所属机构" prop="orgId" required>
				<snowy-org-picker v-model="formData.orgId" placeholder="请选择所属机构" :org-tree-api="selectorApiFunction.orgTreeApi" @validateField="formRef.validateField('orgId')">
				</snowy-org-picker>
			</uv-form-item>
			<uv-form-item label="岗位名称" prop="name" required>
				<uv-input v-model="formData.name" placeholder="请输入岗位名称" fontSize="27rpx"></uv-input>
			</uv-form-item>
			<uv-form-item label="岗位分类" prop="category" required>
				<snowy-sel-picker :map="{key: 'value', label: 'text'}" v-model="formData.category" :rangeData="positionCategoryOptions" placeholder="请选择岗位分类" @validateField="formRef.validateField('category')"></snowy-sel-picker>
			</uv-form-item>
			<uv-form-item label="排序" prop="sortCode" required>
				<uv-number-box v-model="formData.sortCode" button-size="30" color="#ffffff" bgColor="#5677fc" iconStyle="color: #fff" :step="1" :max="100"></uv-number-box>
			</uv-form-item>
		</uv-form>
		<tui-button margin="50rpx 0" :preventClick="true" :shadow="true" @click="submit">提交</tui-button>
	</view>
</template>
<script setup>
	import { nextTick, reactive, ref } from "vue"
	import tool from '@/plugins/tool'
	import { positionDetail, positionOrgTreeSelector, submitForm } from '@/api/biz/bizPositionApi'
	import { onLoad, onShow, onReady, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app"
	const formRef = ref()
	const formData = ref({
		orgId: '',
		name: '',
		category: '',
		sortCode: 99
	})
	const rules = reactive({
		orgId: [{
			type: 'string',
			required: true,
			message: '请选择所属机构',
		}],
		name: [{
			type: 'string',
			required: true,
			message: '请输入岗位名称',
			trigger: ['blur', 'change']
		}],
		category: [{
			type: 'string',
			required: true,
			message: '请选择岗位分类',
		}],
		sortCode: [{
			type: 'number',
			required: true,
			message: '请输入排序',
			trigger: ['blur', 'change']
		}],
	})
	const selectorApiFunction = {
		orgTreeApi: (param) => {
			return positionOrgTreeSelector(param).then((res) => {
				return Promise.resolve(res)
			})
		}
	}
	const positionCategoryOptions = tool.dictList('POSITION_CATEGORY')
	// 加載
	onLoad((option) => {
		if (!option.id) {
			return
		}
		positionDetail({ id: option.id }).then(res => {
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